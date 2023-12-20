import mitt from 'mitt'
import { BusEnum, StorageEnum } from '../enum'
import storage from './storage'
import { useAppStore } from '../store/app'

export default {
  // 关闭页面
  closePage(path?: string) {
    mitt().emit(BusEnum.ClosePage, path || '')
  },
  // 移除路由参数缓存
  removeRouterQuery(path: string) {
    const routerQuery = storage.getSession(StorageEnum.RouterQuery)
    if (routerQuery) {
      Reflect.deleteProperty(routerQuery as any, path)
      storage.setSession(StorageEnum.RouterQuery, routerQuery)
    }
  },
  // 获取父页面路径
  getParentPath(path: string) {
    const appStore = useAppStore()
    const pageRelation = appStore.state.pageRelation[path]
    return pageRelation?.parent
  }
}
