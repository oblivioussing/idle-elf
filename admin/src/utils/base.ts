import { ContentTypeEnum } from '../enum'

export default {
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
  // 是否为空对象
  isEmptyObject(data: object) {
    if (typeof data === 'object') {
      const keys = Object.keys(data)
      return keys.length === 0
    } else {
      return true
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
    blobType: ContentTypeEnum
    filename: string
  }) {
    const blob = new Blob([row.blob], { type: row.blobType })
    let url = window.URL.createObjectURL(blob)
    this.downloadByUrl({ url, filename: row.filename })
    URL.revokeObjectURL(url)
  }
}
