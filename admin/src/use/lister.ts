import { onActivated, onScopeDispose } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { shiki } from '@/api'
import { type ListState as State } from '@/chant'
import { useAppStore } from '@/store'
import { bus } from '@/utils'

type Data = {
  pageElements?: []
  pageData: []
  extra: {}
  totalRecord: number
  [key: string]: any
}
type Result = {
  data?: Data
}

function useLister() {
  const appStore = useAppStore()
  const route = useRoute()
  const router = useRouter()
  const state = {
    allFlag: 0 as 0 | 1,
    columns: [],
    extra: {} as Record<string, any>,
    keepQuery: {} as Record<string, any>,
    lang: {},
    list: [] as any[],
    loading: false,
    pages: { pageNum: 1, pageSize: 20 },
    query: {} as Record<string, any>,
    selectionList: [] as any[],
    total: 0
  }

  // created
  function created(
    callback: () => void,
    state?: State,
    config?: {
      queryMerge?: boolean
    }
  ) {
    // 参数合并
    if (state) {
      if (config?.queryMerge !== false) {
        Object.assign(state.query, route.query)
      }
      // onActivated
      onActivated(() => {
        const status = isRouterQueryModify(state)
        if (status) {
          reset(state)
          if (config?.queryMerge !== false) {
            Object.assign(state.query, route.query)
          }
          callback()
        }
      })
    }
    // 事件监听
    on(callback)
    // callback
    callback()
  }
  // 路由参数是否变化
  function isRouterQueryModify(state: State) {
    let status = false
    const query = route.query
    for (let item in query) {
      if (query[item] !== state.query[item]) {
        status = true
      }
    }
    return status
  }
  // 获取数据
  async function getData(
    path: string,
    state: State,
    config?: {
      limit?: boolean
      custom?: boolean
    }
  ) {
    state.list = []
    const query = getQuery(state)
    if (config?.limit !== false) {
      Object.assign(query, state.pages)
    }
    state.loading = true
    const ret: Result = await shiki?.getData(path, query)
    // 返回数据
    if (config?.custom) {
      state.loading = false
      return ret?.data
    }
    // 数据处理
    const status = dataDeal(state, ret?.data, config?.limit)
    return status
  }
  // 获取查询参数
  function getQuery(state: State) {
    const query = { ...state.keepQuery, ...state.query }
    return query
  }
  // 获取列表参数
  function getListParams(state: State) {
    return {
      idList: state.selectionIdList,
      allFlag: state.allFlag,
      searchAllForm: getQuery(state)
    }
  }
  // 数据处理
  function dataDeal(state: State, data?: Data, limit?: boolean) {
    state.loading = false
    if (data) {
      if (limit !== false) {
        state.list = data?.list || []
        state.total = data?.total || 0
      } else {
        state.list = data as any
      }
      // extra
      state.extra = data?.extra || {}
      return true
    }
  }
  // 事件监听
  function on(callback: () => any, name?: string) {
    name = name || route?.path
    name && bus.on(name, callback)
    // onScopeDispose
    onScopeDispose(() => {
      name && bus.off(name)
    })
  }
  // 查询
  function query(method: Function, state: State) {
    state.pages.pageNum = 1
    method()
  }
  // 刷新
  function refresh(method: Function, state: State) {
    reset(state)
    method()
  }
  // 重置
  function reset(state: State) {
    state.selectionList = []
    state.selectionRow = {}
    state.query = {}
    state.pages.pageNum = 1
    state.pages.pageSize = 20
  }
  // 新增
  function add() {
    // 页面跳转
    jump('/add')
  }
  // 复制新增
  function copyAdd(state: State) {
    const query = { id: state.selectionRow.id, pageType: 'copy-add' }
    // 页面跳转
    jump('/add', query)
  }
  // 编辑
  function edit(state: State) {
    const query = { id: state.selectionRow.id }
    // 页面跳转
    jump('/edit', query)
  }
  // 页面跳转
  function jump(to: string, query?: any) {
    const path = route?.path || ''
    const toPath = path?.replace('/index', to)
    appStore.updatePageRelation(toPath, path)
    router.push({ path: toPath, query })
  }
  // 删除
  async function remove(path: string, state: State) {}

  return {
    state,
    created,
    getData,
    dataDeal,
    query,
    refresh,
    reset,
    add,
    copyAdd,
    edit,
    jump,
    remove,
    getListParams
  }
}

export default useLister
