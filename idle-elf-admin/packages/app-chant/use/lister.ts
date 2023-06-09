import { onActivated, onScopeDispose } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { shiki, BlobType } from '../api'
import { LangEnum, SysCode } from '../enum'
import { element, vuei18n } from '../plugs'
import { base, bus, core } from '../share'
import { useAppStore } from '../store'
import { ListColumn as Column, Dict, ListState } from '../type'
import useChaoser from './chaoser'

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
  dict?: Dict
}

const messages = {
  en: {
    please: 'Please select ',
    only: 'Only one item can be selected to ',
    data: ' data',
    confirmDelete: 'Confirm delete?',
    tenantMust: 'please select a tenant',
    systemTypeMust: 'system type must'
  },
  zh: {
    please: '请选择要',
    only: '只能选择一条要',
    data: '的数据',
    confirmDelete: '确认删除?',
    tenantMust: '请选择租户',
    systemTypeMust: '请选择系统类型'
  }
}

function useLister(config?: { platform?: boolean }) {
  const appStore = useAppStore()
  const chaoser = useChaoser()
  const route = useRoute()
  const router = useRouter()
  const { t: tg } = useI18n({ useScope: 'global' })
  const locale = vuei18n.global.locale
  let sysCode = ''
  if (config?.platform !== false) {
    sysCode = appStore.defaultValue.sysCode
  }
  const meta = chaoser.getMetaByPath()
  const funKeyList = meta?.funKeyList as string[] | undefined
  const state = {
    allFlag: 0 as 0 | 1,
    columns: [],
    dict: {} as Dict,
    extra: {} as Record<string, any>,
    extraQuery: {} as Record<string, any>,
    jumpParams: {} as Record<string, any>,
    urlParams: {} as Record<string, any>,
    lang: {},
    list: [] as any[],
    loading: false,
    pages: { pageNum: 1, pageSize: 20 },
    pageElements: [],
    query: {} as Record<string, any>,
    resultDict: {},
    selectionId: '',
    selectionRow: {} as Record<string, any>,
    selectionIdList: [] as string[],
    selectionList: [] as any[],
    tenant: {
      sysCode,
      tenantId: '' as string,
      tenantName: '' as string
    },
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
      state.urlParams = route.query as any
      if (config?.queryMerge !== false) {
        Object.assign(state.query, route.query)
      }
      // onActivated
      onActivated(() => {
        const status = isRouterQueryModify(state)
        if (status) {
          reset(state)
          state.urlParams = route.query as any
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
      dict?: Record<string, any>
      custom?: boolean
      clear?: boolean
    }
  ) {
    if (config?.clear !== false) {
      state.list = []
    }
    const query = getQuery(state)
    if (config?.limit !== false) {
      Object.assign(query, state.pages)
    }
    state.loading = true
    const ret: Result = await shiki?.getData(path, query)
    // 字典
    if (ret.dict) {
      state.resultDict = ret.dict
    }
    // 绑定字典
    if (config?.dict) {
      dictBind(config.dict, state)
    }
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
    const query = { ...state.extraQuery, ...state.query }
    // psa带上租户信息
    if (core.isPsa()) {
      const { sysCode, tenantId } = state.tenant || {}
      query.sysCode = sysCode
      // 如果为平台则需要租户id
      if (query.sysCode === SysCode.Admin) {
        query.tenantId = tenantId
      }
    }
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
        state.list = data?.pageData || []
        state.total = data?.totalRecord || 0
      } else {
        state.list = data as any
      }
      // extra
      state.extra = data?.extra || {}
      // pageElements
      const pageElements = data?.pageElements
      if (pageElements?.length) {
        state.pageElements = pageElements
        // lang
        createLang(state)
      }
      return true
    }
  }
  // lang
  function createLang(state: State) {
    const columns = state.pageElements
    const en: Record<string, any> = {}
    const zh: Record<string, any> = {}
    columns?.forEach((item) => {
      en[item.prop] = item.labelEn
      zh[item.prop] = item.labelZh
    })
    state.lang = { en, zh }
  }
  // columns
  function createColumns(state: State, columns: Column[]) {
    const pageElements = state?.pageElements
    if (pageElements?.length) {
      const list = columns.filter((item) => {
        // operate
        if (item.prop === 'operate') {
          return true
        }
        const index = pageElements?.findIndex(
          (child) => child.prop === item.prop
        )
        return index >= 0
      })
      state.columns = list
    }
  }
  // 字典绑定
  function dictBind(map: Record<string, any>, state: State) {
    if (state.resultDict) {
      for (let item in map) {
        if (state.dict) {
          state.dict[item] = state.resultDict[map[item]]
        }
      }
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
    resetPages(state)
    method()
  }
  // 刷新
  function refresh(method: Function, state: State, extraClear?: boolean) {
    reset(state, extraClear)
    method()
  }
  // 清空url参数
  function clearUrlQuery() {
    base.removeRouterQuery(route.path)
    history.replaceState(history.state, '', route.path)
  }
  // 重置
  function reset(state: State, extraClear?: boolean) {
    if (extraClear) {
      state.extraQuery = {}
    }
    state.query = {}
    resetPages(state)
    state.pages.pageSize = 20
  }
  // 重置page
  function resetPages(state: State) {
    state.pages.pageNum = 1
  }
  // 新增
  function add(state?: State) {
    const { sysCode, tenantId } = state?.tenant || {}
    if (core.isPsa()) {
      if (!sysCode) {
        const { systemTypeMust } = messages[locale.value as LangEnum]
        ElMessage.warning(systemTypeMust)
        return
      }
      if (sysCode === SysCode.Admin && !tenantId) {
        const { tenantMust } = messages[locale.value as LangEnum]
        ElMessage.warning(tenantMust)
        return
      }
    }
    let params
    if (state) {
      params = { ...state.tenant, ...state.jumpParams }
    }
    // 页面跳转
    jump(params, '/add')
  }
  // 复制新增
  function copyAdd(state: State, linkData?: string[] | undefined) {
    const status = getDealData(state, tg('button.copyAdd'))
    if (status) {
      const query = linkDataTrans(state.selectionRow, linkData, state.tenant)
      query.pageType = 'copy-add'
      Object.assign(query, state.jumpParams)
      // 页面跳转
      jump(query, '/add')
    }
  }
  // 编辑
  function edit(state: State, linkData?: string[] | undefined) {
    const status = getDealData(state, tg('button.edit'))
    if (status) {
      const query = linkDataTrans(state.selectionRow, linkData, state.tenant)
      Object.assign(query, state.jumpParams)
      // 页面跳转
      jump(query, '/edit')
    }
  }
  // 获取要处理的数据
  function getDealData(state: State, msg: string, multiple?: boolean) {
    const selection = state.selectionList as any[]
    const { please, data, only } = messages[locale.value as LangEnum]
    // 请选择数据
    if (!selection.length && state.allFlag === 0) {
      ElMessage.warning(`${please}${msg}${data}`)
      return false
    }
    // 只能选择一条数据
    if (!multiple) {
      if (selection.length > 1 || state.allFlag === 1) {
        ElMessage.warning(`${only}${msg}${data}`)
        return false
      }
    }
    return true
  }
  // 页面跳转
  function jump(query: any, to: string) {
    const path = route?.path || ''
    const toPath = path?.replace('/index', to)
    appStore.updatePageRelation(toPath, path)
    router.push({ path: toPath, query: base.filterObjectEmpty(query) })
  }
  // 删除
  async function remove(path: string, state: State) {
    const { confirmDelete } = messages[locale.value as LangEnum]
    return await operate(path, state, {
      selectionTip: tg('button.delete'),
      confirmTip: confirmDelete
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
    const { only, please, data } = messages[locale.value as LangEnum]
    if (state.allFlag !== 1 && selection.length === 0) {
      const selectionTip = please + config.selectionTip + data
      ElMessage.warning(selectionTip)
      return
    }
    // 只能选择一条数据
    if (config.multiple === false) {
      if (selection.length > 1 || state.allFlag === 1) {
        ElMessage.warning(`${only}${config.selectionTip}${data}`)
        return
      }
    }
    let confirmTip
    if (config.confirmTip) {
      confirmTip = config.confirmTip
    } else {
      confirmTip = tg('button.confirm') + config.selectionTip + '?'
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
    const code = await shiki?.postCode(path, params)
    const isSuccess = shiki?.isSuccess(code)
    if (isSuccess) {
      const route = router?.currentRoute.value
      const path = route?.path
      path && bus.emit(path)
      return isSuccess
    }
  }
  // 参数转化
  function linkDataTrans(
    row: any,
    linkData?: any[],
    tenant?: Record<string, any>
  ) {
    const query: Record<string, any> = {}
    if (linkData) {
      linkData.forEach((item) => {
        if (typeof item === 'string') {
          query[item] = row[item]
        } else if (typeof item === 'object') {
          for (let child in item) {
            query[child] = row[item[child]]
          }
        }
      })
    } else {
      query.id = row.id
    }
    if (core.isPsa() && tenant) {
      Object.assign(query, tenant)
    }
    return base.filterObjectEmpty(query)
  }
  // 导出
  function download(
    row: {
      path: string
      filename: string
      blobType: BlobType
    },
    state: State,
    config?: { selected?: boolean; params?: any }
  ) {
    config = config || {}
    if (config.selected !== false) {
      config.selected = true
    }
    const { selectionList, allFlag } = state
    const idList = selectionList.map((item) => item.id)
    if (config.selected) {
      if (!idList.length && allFlag === 0) {
        const { please, data } = messages[locale.value as LangEnum]
        ElMessage.warning(`${please}${tg('button.export')}${data}`)
        return
      }
    }
    let filename = ''
    if (row.blobType === BlobType.Excel) {
      filename = `${row.filename}.xlsx`
    }
    if (row.blobType === BlobType.Json) {
      filename = `${row.filename}.json`
    }
    const params = {
      blobType: row.blobType,
      filename,
      params: config.params || {
        idList,
        allFlag,
        searchAllForm: getQuery(state)
      }
    }
    shiki.download(row.path, params)
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
  // 权限校验
  function permission(val: string) {
    return funKeyList?.includes(val)
  }

  return {
    state,
    created,
    getData,
    dataDeal,
    on,
    dictBind,
    createColumns,
    query,
    refresh,
    reset,
    clearUrlQuery,
    resetPages,
    add,
    copyAdd,
    edit,
    getDealData,
    jump,
    remove,
    linkDataTrans,
    operate,
    download,
    updateColumn,
    permission,
    getQuery,
    getListParams
  }
}

export default useLister
