import qs from 'qs'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import { ContentTypeEnum } from '@/enum'

// 请求配置
export type RequestConfig = {
  body?: any
  headers?: Record<string, string>
  method?: 'GET' | 'POST'
  params?: any
  timeout?: number
  url: string
}

class Ryougi {
  // 基础请求url
  baseurl = '/'

  // fetch请求
  async request(config: RequestConfig) {
    const controller = new AbortController()
    const signal = controller.signal
    const timeout = config.timeout || 10 * 1000
    const { method, headers } = config
    // header
    if (!headers) {
      config.headers = {}
    }
    // get
    if (method === 'GET') {
      // 参数拼接在url里面
      if (config.params) {
        const params = qs.stringify(config.params)
        config.url = `${config.url}?${params}`
      }
    }
    // post
    if (method === 'POST') {
      const contentType = headers?.['content-type']
      if (!contentType) {
        config.headers!['content-type'] = 'application/json'
      }
    }
    // fetch
    try {
      const response = await Promise.race([
        this.timeoutSetting(timeout, controller),
        this.fetch(config, signal)
      ])
      return response
    } catch (error) {
      console.error(error)
    }
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
  // fetch请求
  private async fetch(
    config: RequestConfig,
    signal: AbortSignal
  ): Promise<Response> {
    let body = config.body
    const contentType = config.headers?.['content-type']
    if (contentType === ContentTypeEnum.Json) {
      body = JSON.stringify(body)
    }
    // 请求地址拼接
    let url = config.url || ''

    if (!url.includes('http')) {
      url = `${this.baseurl}${url}`
    }
    // 请求配置
    let requestInit: RequestInit = {
      body,
      headers: config.headers,
      method: config.method,
      mode: 'cors',
      signal
    }
    const response = await fetch(url, requestInit)
    return response
  }
}

export default Ryougi
