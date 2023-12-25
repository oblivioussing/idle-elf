import type { FormColumn, ListColumn } from '@/chant/type'
import { BusEnum, StorageEnum } from '@/enum'
import { useAppStore } from '@/store/app'
import base from './base'
import bus from './bus'
import storage from './storage'

type Columns = FormColumn[] | ListColumn[]

export default {
  // 清空url参数
  clearUrlQuery(path: string) {
    // 移除路由参数缓存
    this.removeRouterQuery(path)
    history.replaceState(history.state, '', path)
  },
  // 关闭页面
  closePage(path?: string) {
    bus.emit(BusEnum.ClosePage, path || '')
  },
  // 获取父页面路径
  getParentPath(path: string) {
    const appStore = useAppStore()
    const pageRelation = appStore.state.pageRelation[path]
    return pageRelation?.parent
  },
  // 移除路由参数缓存
  removeRouterQuery(path: string) {
    const routerQuery = storage.getSession(StorageEnum.RouterQuery)
    if (routerQuery) {
      Reflect.deleteProperty(routerQuery as any, path)
      storage.setSession(StorageEnum.RouterQuery, routerQuery)
    }
  },
  // 修改列表字段
  updateColumn<T extends Columns>(
    list: T,
    row: FormColumn | ListColumn,
    config?: { delete?: boolean; merge?: boolean }
  ): T {
    list = base.clone(list)
    const index = list.findIndex((item) => item.prop === row.prop)
    if (config?.merge) {
      list[index] = Object.assign(list[index], row)
    } else if (config?.delete) {
      list.splice(index, 1)
    } else {
      list[index] = row
    }
    return list
  }
}
