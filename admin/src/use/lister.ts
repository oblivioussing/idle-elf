import mitt from 'mitt'
import { onActivated, onScopeDispose } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { shiki } from '../api'
import { element } from '../plugs'
import { base, core } from '../utils'
import { useAppStore } from '../store'
import { type ListColumn as Column, type ListState } from '../type'

type State = ListState
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

const messages = {
  en: {
    please: 'Please select ',
    only: 'Only one item can be selected to ',
    data: ' data',
    confirmDelete: 'Confirm delete?'
  },
  zh: {
    please: '请选择要',
    only: '只能选择一条要',
    data: '的数据',
    confirmDelete: '确认删除?'
  }
}

function useLister() {
  const appStore = useAppStore()
  const route = useRoute()
  const router = useRouter()
  const state = {
    allFlag: 0 as 0 | 1,
    columns: [],
    extra: {} as Record<string, any>,
    lang: {},
    list: [] as any[],
    loading: false,
    pages: { pageNum: 1, pageSize: 20 },
    query: {} as Record<string, any>,
    selectionRow: {} as Record<string, any>,
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
    const query = { ...state.query }
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
    name && mitt().on(name, callback)
    // onScopeDispose
    onScopeDispose(() => {
      name && mitt().off(name)
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
  // 清空url参数
  function clearUrlQuery() {
    core.removeRouterQuery(route.path)
    history.replaceState(history.state, '', route.path)
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
    const status = getDealData(state, '复制新增')
    if (status) {
      const query = { id: state.selectionRow.id, pageType: 'copy-add' }
      // 页面跳转
      jump('/add', query)
    }
  }
  // 编辑
  function edit(state: State) {
    const status = getDealData(state, '编辑')
    if (status) {
      const query = { id: state.selectionRow.id }
      // 页面跳转
      jump('/edit', query)
    }
  }
  // 获取要处理的数据
  function getDealData(state: State, msg: string, multiple?: boolean) {
    const selection = state.selectionList as any[]
    // 请选择数据
    if (!selection.length && state.allFlag === 0) {
      ElMessage.warning(`请选择${msg}数据`)
      return false
    }
    // 只能选择一条数据
    if (!multiple) {
      if (selection.length > 1 || state.allFlag === 1) {
        ElMessage.warning(`只能${msg}数据`)
        return false
      }
    }
    return true
  }
  // 页面跳转
  function jump(to: string, query?: any) {
    const path = route?.path || ''
    const toPath = path?.replace('/index', to)
    appStore.updatePageRelation(toPath, path)
    router.push({ path: toPath, query })
  }
  // 删除
  async function remove(path: string, state: State) {
    return await operate(path, state, {
      selectionTip: '删除',
      confirmTip: '确定删除'
    })
  }
  // 操作
  async function operate(
    path: string,
    state: State,
    config: {
      selectionTip: string
      confirmTip?: string
      params?: object
      multiple?: boolean
    }
  ) {
    const selection = state.selectionList
    if (state.allFlag !== 1 && selection.length === 0) {
      const selectionTip = '请选择' + config.selectionTip + '数据'
      ElMessage.warning(selectionTip)
      return
    }
    // 只能选择一条数据
    if (config.multiple === false) {
      if (selection.length > 1 || state.allFlag === 1) {
        ElMessage.warning(`只能${config.selectionTip}数据`)
        return
      }
    }
    let confirmTip
    if (config.confirmTip) {
      confirmTip = config.confirmTip
    } else {
      confirmTip = '确定' + config.selectionTip + '?'
    }
    const status = await element.confirm(confirmTip)
    if (!status) {
      return
    }
    const idList = state.selectionIdList
    const query = getQuery(state)
    const params = {
      idList,
      allFlag: state.allFlag,
      searchAllForm: query
    }
    Object.assign(params, config.params)
    state.loading = true
    const code = await shiki?.postCode(path, params)
    state.loading = false
    const isSuccess = shiki?.isSuccess(code)
    if (isSuccess) {
      const route = router?.currentRoute.value
      const path = route?.path
      path && mitt().emit(path)
      return isSuccess
    }
  }
  // 修改字段
  function updateColumn(
    list: Column[],
    row: Column,
    config?: { merge: boolean }
  ) {
    list = base.clone(list)
    list.forEach((item, index) => {
      if (item.prop === row.prop) {
        if (config?.merge) {
          list[index] = Object.assign(item, row)
        } else {
          list[index] = row
        }
      }
    })
    return list
  }

  return {
    state,
    created,
    getData,
    dataDeal,
    on,
    query,
    refresh,
    reset,
    clearUrlQuery,
    add,
    copyAdd,
    edit,
    getDealData,
    jump,
    remove,
    operate,
    updateColumn,
    getListParams
  }
}

export default useLister
