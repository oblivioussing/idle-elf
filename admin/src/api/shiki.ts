import qs from 'qs'
import { ElMessage } from 'element-plus'
import { ApiCode, BlobTypeEnum } from '../enum'
import base from '../utils/base'
import { useUserStore } from '../store'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

// 返回类型枚举
enum ResponseType {
  Code,
  Data,
  All,
  Blob
}
// 请求方法
export enum Method {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}
// 返回结果
type Result = {
  code: ApiCode
  data: any
  msg: string
}
// 请求配置
type RequestConfig = {
  url?: string
  params?: object | boolean
  body?: object | string
  timeout?: number
  method?: Method
  headers?: HeadersInit
  responseType?: ResponseType
  tip?: boolean
  failTip?: boolean
}
// 消息提示配置
type MessageConfig = {
  requestConfig: RequestConfig
  response?: Response
  result?: Result
  error?: Error
}

class Shiki {
  // 请求拦截器
  private requestInterceptors: Function[] = []
  // 响应拦截器
  private responseInterceptors: Function[] = []
  // 基础请求url
  baseurl = '/'
  // 拦截器
  interceptors = {
    request: {
      use: (callback: Function) => {
        this.requestInterceptors.push(callback)
      }
    },
    response: {
      use: (callback: Function) => {
        this.responseInterceptors.push(callback)
      }
    }
  }
  // 自定义message方法
  customMessage = (_: string) => {}

  // get请求
  async get(url: string, config?: RequestConfig): Promise<any> {
    if (!config) {
      config = {} as RequestConfig
    }
    config.url = url
    config.method = Method.Get
    // params不可能是boolean值,如果是则说明他代表tip
    if (typeof config.params === 'boolean') {
      config.tip = config.params
      delete config.params
    }
    // 发送http请求
    return await this.fetchRequest(config)
  }
  // get请求(返回code)
  async getCode(
    url: string,
    params?: object | boolean,
    row?: { tip?: boolean; failTip?: boolean }
  ): Promise<any> {
    const config = {
      url,
      params,
      tip: row?.tip === false ? false : true,
      failTip: row?.failTip,
      responseType: ResponseType.Code
    }
    return await this.get(url, config)
  }
  // get请求(返回结果)
  async getData(
    url: string,
    params?: object | boolean,
    row?: { tip?: boolean; failTip?: boolean }
  ): Promise<any> {
    const config = {
      url,
      params,
      tip: row?.tip === false ? false : true,
      failTip: row?.failTip,
      responseType: ResponseType.Data
    }
    return await this.get(url, config)
  }
  // post请求
  async post(url: string, config: RequestConfig): Promise<any> {
    config.url = url
    config.method = Method.Post
    if (!config.headers) {
      config.headers = {
        'content-type': 'application/json'
      }
    }
    // 发送http请求
    return await this.fetchRequest(config)
  }
  // post请求(返回code)
  async postCode(
    url: string,
    body?: object,
    row?: { tip?: boolean; failTip?: boolean }
  ): Promise<any> {
    const config = {
      url,
      body,
      tip: row?.tip === false ? false : true,
      failTip: row?.failTip,
      responseType: ResponseType.Code
    }
    return await this.post(url, config)
  }
  // post请求(返回结果)
  async postData(
    url: string,
    body?: object,
    row?: { tip?: boolean; failTip?: boolean }
  ): Promise<any> {
    const config = {
      url,
      body,
      tip: row?.tip === false ? false : true,
      failTip: row?.failTip,
      responseType: ResponseType.Data
    }
    return await this.post(url, config)
  }
  // 上传文件
  async upload(
    url: string,
    row: {
      body: FormData
      timeout: number
    },
    tip = true
  ) {
    const config = {
      url,
      body: row.body,
      timeout: row.timeout,
      tip,
      responseType: ResponseType.All,
      headers: {}
    }
    return await this.post(url, config)
  }
  // 下载文件
  async download(
    url: string,
    row: {
      blobType: BlobTypeEnum
      filename: string
      method?: Method
      params?: {}
      tip?: boolean
    },
    tip = true
  ) {
    const config = {
      method: row.method,
      params: row.params
    }
    const result = await this.getBlob(url, config, tip)
    if (result) {
      const { blobType, filename } = row
      if (result.blob?.size) {
        base.downloadByBlob({
          blob: result.blob,
          blobType: result.contentType || blobType,
          filename: result.filename || filename
        })
      } else {
        ElMessage.error('blob size为0,导出失败')
      }
    }
  }
  // 获取blob
  async getBlob(
    url: string,
    row: { method?: Method; params?: {} },
    tip = true
  ): Promise<{ filename: string; contentType: BlobTypeEnum; blob: Blob }> {
    const config = {} as RequestConfig
    config.url = url
    config.method = row.method || Method.Post
    if (config.method === Method.Post) {
      config.body = row.params
    } else {
      config.params = row.params
    }
    config.tip = tip
    config.responseType = ResponseType.Blob
    config.headers = {
      'content-type': 'application/json'
    }
    const result = await this.fetchRequest(config)
    return result
  }
  // 请求是否成功
  isSuccess(code?: string): boolean {
    return code === ApiCode.Success
  }
  // fetch请求
  private async fetchRequest(config: RequestConfig) {
    const controller = new AbortController()
    const signal = controller.signal
    const timeout = config.timeout || 60 * 1000
    // token
    const userStore = useUserStore()
    // header设置
    config.headers = {
      ...config.headers,
      token: userStore.token
    }
    // 业务处理
    this.businessDeal(config)
    // get
    if (config.method === Method.Get) {
      // 参数拼接在url里面
      if (config.params) {
        // 过滤空值
        const rows = base.filterObjectEmpty(config.params)
        const params = qs.stringify(rows)
        config.url = `${config.url}?${params}`
      }
    }
    // fetch
    try {
      let response = await Promise.race([
        this.timeoutSetting(timeout, controller),
        this.fetchSend(config, signal)
      ])
      // 返回blob
      if (config.responseType === ResponseType.Blob) {
        const status = response.status
        if (status !== 200) {
          return null
        }
        const headers = response.headers
        let contentType = headers.get('content-type')?.split(';') as any
        contentType = contentType && contentType[0]
        let json
        // 如果返回的结果中包含resultMsg说明请求已经报错
        if (contentType === BlobTypeEnum.Json) {
          json = await response.json()
          if (json.resultMsg) {
            ElMessage.error(json.resultMsg)
            return null
          }
        }
        const filename = decodeURI(headers.get('filename') || '')
        let blob
        if (contentType === BlobTypeEnum.Json) {
          blob = new Blob([JSON.stringify(json)])
        } else {
          blob = await response.blob()
        }
        return { contentType: contentType || '', filename, blob }
      }
      // 返回json
      return await this.reponseJson(config, response)
    } catch (error) {
      console.error(error)
      // 消息提示
      this.message({ requestConfig: config, error: error as Error })
      // TODO: 上报错误日志
    }
  }
  // 业务处理
  private businessDeal(config: RequestConfig) {
    if (config.method === Method.Post) {
      const body = config.body as any
      if (!body) {
        return
      }
      if (body.allFlag === 0) {
        Reflect.deleteProperty(body, 'allFlag')
        Reflect.deleteProperty(body, 'searchAllForm')
      } else if (body.allFlag === 1) {
        Reflect.deleteProperty(body, 'idList')
      }
    }
  }
  // 返回json
  private async reponseJson(config: RequestConfig, response: Response) {
    let result = {} as Result
    const requestConfig = config
    if (response.status === 200) {
      response = await response.json()
      // 结果转化
      result = response as any
      // 响应拦截器
      this.responseInterceptors.forEach((callback) => {
        response = callback(response)
      })
      this.message({ requestConfig, result })
    } else {
      this.message({ requestConfig, response })
    }
    // 返回结果处理
    const data = await this.responseProcess(result, config)
    return data
  }
  // 超时设置
  private timeoutSetting(
    timeout: number,
    controller: AbortController
  ): Promise<Response> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Response('timeout', { status: 504, statusText: 'timeout' }))
        controller.abort()
      }, timeout)
    })
  }
  // fetch实际发出请求
  private async fetchSend(
    config: RequestConfig,
    signal: AbortSignal
  ): Promise<Response> {
    let body = config.body as any
    const headers = config.headers as any
    if (headers && headers['content-type'] === 'application/json') {
      body = JSON.stringify(body)
    }
    // 请求配置
    let requestInit: RequestInit = {
      signal,
      mode: 'cors',
      method: config.method,
      headers,
      body
    }
    // 请求拦截器
    this.requestInterceptors.forEach((callback) => {
      requestInit = callback(requestInit)
    })
    // 请求地址拼接
    let url = config.url || ''
    if (url.indexOf('http') !== 0) {
      url = `${this.baseurl}${url}`
    }
    let response = await fetch(url, requestInit)
    return response
  }
  // 消息提示
  private message(config: MessageConfig) {
    const { requestConfig, result, response, error } = config
    // tip为false不提示
    if (requestConfig.tip === false) {
      return
    }
    // post请求成功显示提示
    const isSuccess = this.isSuccess(result?.code)
    if (isSuccess) {
      if (requestConfig.failTip) {
        return
      }
      if (requestConfig.method === Method.Post) {
        ElMessage.success({
          message: result?.msg,
          duration: 2000,
          showClose: true
        })
      }
      return
    }
    let messageText = result?.msg
    if (response) {
      messageText = response.statusText
    }
    if (error) {
      messageText = `${error.name}: ${error.message}`
    }

    ElMessage.closeAll()
    ElMessage.error({ message: messageText, duration: 2000, showClose: true })
  }
  // 返回结果处理
  private responseProcess(result: Result, config: RequestConfig): any {
    const responseType = config.responseType
    // 返回code
    if (responseType === ResponseType.Code) {
      return result?.code
    }
    // 返回data
    if (responseType === ResponseType.Data) {
      const data = result?.data
      return { data }
    }
    // 返回全部
    return result
  }
}

export { type Result, Shiki }
export default new Shiki()
