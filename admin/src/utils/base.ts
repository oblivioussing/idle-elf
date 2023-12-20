import { BlobTypeEnum } from '../enum'

export default {
  // 去除空白字符
  spaceDel(val: string) {
    const reg = new RegExp('\\s', 'g')
    return val.replace(reg, '')
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
  // 获取文件名
  getFileName(path: string) {
    return path.replace(/(.*\/)*([^.]+).*/g, '$2')
  },
  // 文件拓展名
  checkFileName(arr: string[]) {
    const str = arr.map((name) => `.${name}`).join('|')
    return new RegExp(`(${str})$`)
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
  downloadByUrl(row: { url: string; filename?: string }) {
    let url = row.url
    let filename = row.filename
    if (!filename) {
      const list = row.url?.split('/')
      filename = list[list.length - 1]
    }
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('href', url)
    link.setAttribute('download', filename!)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },
  // 下载根据blob
  downloadByBlob(row: {
    blob: Blob
    blobType: BlobTypeEnum
    filename: string
  }) {
    const blob = new Blob([row.blob], { type: row.blobType })
    let url = window.URL.createObjectURL(blob)
    this.downloadByUrl({ url, filename: row.filename })
    URL.revokeObjectURL(url)
  }
}
