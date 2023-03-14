import SparkMD5 from 'spark-md5'
import bus from './bus'
import core from './core'
import { Bus, StorageEnum } from '../enum'
import { BlobType } from '../api/shiki'
import { vuei18n } from '../plugs/i18n'
import storage from './storage'
import { useAppStore } from '../store/app'

export default {
  // 去除空白字符
  spaceDel(val: string) {
    const reg = new RegExp('\\s', 'g')
    return val.replace(reg, '')
  },
  // 手机号码分段
  mobileCut(val: string) {
    val = this.spaceDel(val)
    let tpl = ''
    for (let i = 0; i < val.length; i++) {
      if (i == 2 || i == 6) {
        tpl = tpl + val.charAt(i) + ' '
      } else {
        tpl = tpl + val.charAt(i)
      }
    }
    return tpl
  },
  // 对象数组去重
  distinct(arr: any[], field = 'id') {
    const res = new Map()
    return arr.filter(
      (item) => !res.has(item[field]) && res.set(item[field], 1)
    )
  },
  // 简单数组去重
  sole(arr: any[]) {
    return Array.from(new Set(arr))
  },
  // 克隆
  clone<T>(obj: T): T {
    let newobj: any
    if (typeof obj == 'object' && obj !== null) {
      newobj = obj instanceof Array ? [] : {}
      for (var i in obj) {
        newobj[i] = this.clone(obj[i])
      }
    } else {
      newobj = obj
    }
    return newobj
  },
  // 防抖
  debounce(fn: Function, time = 200) {
    let timer: any
    return () => {
      timer !== null && clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this)
      }, time)
    }
  },
  // 节流
  throttle(fn: Function, time = 200) {
    let timer: any
    return () => {
      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(this)
          timer = 0
        }, time)
      }
    }
  },
  // 是否处于浏览器中
  inBrowser() {
    return typeof window !== 'undefined'
  },
  // 是否为空
  isEmpty(data: any, char = true) {
    if (data === 0) {
      return false
    }
    if (char === false && data === '') {
      return false
    }
    if (!data) {
      return true
    }
    if (typeof data === 'object') {
      const keys = Object.keys(data)
      if (!keys.length) {
        return true
      }
    }
    if (Array.isArray(data) && !data.length) {
      return true
    }
  },
  // 获取url参数
  getUrlParam(url?: string) {
    url = url || window.location.href
    const urlObject = {} as Record<string, any>
    if (/\?/.test(url)) {
      const urlString = url.substring(url.indexOf('?') + 1)
      const urlArray = urlString.split('&')
      for (let i = 0, len = urlArray.length; i < len; i++) {
        const urlItem = urlArray[i]
        const item = urlItem.split('=')
        urlObject[item[0]] = item[1]
      }
      return urlObject
    }
  },
  // 动态加载js文件
  loadJs(url: string): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = url
      document.body.appendChild(script)
      script.addEventListener('load', () => {
        resolve()
      })
    })
  },
  // 动态加载link文件
  loadLink(url: string, rel: 'stylesheet' | 'icon'): Promise<void> {
    return new Promise((resolve) => {
      const link = document.createElement('link')
      link.href = url
      link.rel = rel
      document.head.appendChild(link)
      link.addEventListener('load', () => {
        resolve()
      })
    })
  },
  // 动态加载iconfont
  loadIconfont() {
    let url = '/sc/aimiicon/assets/1/font/iconfont.css'
    this.loadLink(url, 'stylesheet')
  },
  // 获取文件名
  getFileName(path: string) {
    return path.replace(/(.*\/)*([^.]+).*/g, '$2')
  },
  // 文件拓展名
  checkFileName(arr: string[]) {
    const str = arr.map((name) => `.${name}`).join('|')
    return new RegExp(`(${str})$`)
  },
  // 给语言包添加模块
  langModule(messages: any, module?: string) {
    if (!module) {
      return messages
    }
    const map = {} as any
    for (let item in messages) {
      map[item] = module
        .split('.')
        .reduceRight((i, v) => ({ [v]: i }), messages[item])
    }
    return map
  },
  // 关闭页面
  closePage(path?: string) {
    bus.emit(Bus.ClosePage, path || '')
  },
  // 过滤对象空值
  filterObjectEmpty(params: any, char = true) {
    if (params?.constructor === Object) {
      params = this.clone(params)
      for (let item in params) {
        if (this.isEmpty(params[item], char)) {
          Reflect.deleteProperty(params, item)
        }
      }
    }
    return params
  },
  // 下载根据url
  downloadByUrl(row: { url: string; filename: string }) {
    let url = row.url
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('href', row.url)
    link.setAttribute('download', row.filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },
  // 下载根据blob
  downloadByBlob(row: { blob: Blob; blobType: BlobType; filename: string }) {
    const blob = new Blob([row.blob], { type: row.blobType })
    let url = window.URL.createObjectURL(blob)
    this.downloadByUrl({ url, filename: row.filename })
    URL.revokeObjectURL(url)
  },
  // 获取md5根据文件
  getMd5ByFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const fileReader = new FileReader()
      fileReader.readAsBinaryString(file)
      fileReader.onload = (e: any) => {
        const md5 = SparkMD5.hashBinary(e.target.result)
        resolve(md5)
      }
    })
  },
  // 合并i18n
  mergeLocaleMessage(messages: any) {
    for (let item in messages) {
      vuei18n.global.mergeLocaleMessage(item, messages[item])
    }
  },
  // 移除路由参数缓存
  removeRouterQuery(path: string) {
    const routerQuery = storage.getSession(StorageEnum.RouterQuery)
    if (routerQuery) {
      Reflect.deleteProperty(routerQuery as any, path)
      storage.setSession(StorageEnum.RouterQuery, routerQuery)
    }
  },
  // uuid
  getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      }
    )
  },
  // 获取当前需要拼接的地址
  getLocationPath() {
    if (core.inDevelopment()) {
      const path = core.getBaseApiUrl()
      return path.substring(0, path.length - 1)
    } else {
      return ''
    }
  },
  // 获取父页面路径
  getParentPath(path: string) {
    const appStore = useAppStore()
    const pageRelation = appStore.pageRelation[path]
    return pageRelation?.parent
  },
  // time="2018-05-19T08:04:52.000+0000" 格式转换为正常时间格式
  supplementZero(value: number) {
    return value < 10 ? `0` + value : value
  }
}
