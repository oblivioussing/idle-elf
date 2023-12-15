import { onActivated } from 'vue'
import { useRoute } from 'vue-router'
import shiki from '../api/shiki'
import { type FormColumn as Column } from '../type'
import { base, bus } from '../utils'

type State = {
  dict: Record<string, any>
  form: {
    pageElements?: Column[]
    [key: string]: any
  }
  formLoading: boolean
  lang: Record<string, any>
  loading: boolean
  model: Column[]
  query: Record<string, any>
  resultDict: Record<string, any>
}

function useFormer() {
  const route = useRoute()
  const state = {
    dict: {} as any,
    form: {} as any,
    formLoading: false,
    lang: {},
    loading: false,
    model: [],
    query: {} as any,
    resultDict: {} as any
  }

  // 初始化
  function created(
    callback: () => void,
    state?: { query: Record<string, any> }
  ) {
    if (state) {
      state.query = route?.query
    }
    callback()
    // onActivated
    onActivated(() => {
      if (!state) {
        return
      }
      if (JSON.stringify(state.query) !== JSON.stringify(route.query)) {
        state.query = route?.query
        callback()
      }
    })
  }
  // 获取数据
  async function getData(
    path: string,
    state: State,
    config?: { merge?: boolean; dict?: any; query?: any; loading?: boolean }
  ) {
    const query = config?.query || state.query
    state.formLoading = true
    const { data, dict, defaultValue } = await shiki?.getData(path, query)
    if (!config?.loading) {
      state.formLoading = false
    }
    let status = false
    // 数据处理
    if (data) {
      state.form = data
      status = true
    }
    if (defaultValue && config?.merge) {
      state.form = Object.assign(state.form, defaultValue)
    }
    if (dict) {
      state.resultDict = dict
    }
    if (config?.dict) {
      // 绑定字典
      dictBind(config.dict, state)
    }
    return status
  }
  // 获取字典
  async function getDict(
    path: string,
    state: State,
    config?: { merge?: boolean; dict?: any }
  ) {
    const { dict: resultDict, defaultValue } = await shiki?.getData(
      path,
      state.query
    )
    if (defaultValue && config?.merge) {
      state.form = Object.assign(state.form, defaultValue)
    }
    if (resultDict) {
      state.resultDict = resultDict
      // 绑定字典
      dictBind(config?.dict, state)
      return true
    }
  }
  // columns
  function createColumns(state: State, columns: Column[]) {
    const formColumns = state.form?.pageElements
    if (formColumns?.length) {
      state.model = columns.filter((item) => {
        return formColumns.find((child) => child.prop === item.prop)
      })
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
  // 字典绑定
  function dictBind(map: Record<string, any>, state: State) {
    if (state.resultDict) {
      for (let item in map) {
        state.dict[item] = state.resultDict[map[item]]
      }
    }
  }
  // 保存
  async function save(path: string, state: State, params?: any) {
    state.loading = true
    const code = await shiki?.postCode(path, params || state.form)
    state.loading = false
    if (shiki?.isSuccess(code)) {
      // 刷新列表
      refresh()
      // 关闭页面
      base.closePage()
      return true
    }
  }
  // 刷新列表
  function refresh() {
    const path = base.getParentPath(route?.path)
    if (path) {
      bus.emit(path)
    }
  }

  return {
    state,
    created,
    createColumns,
    updateColumn,
    getData,
    getDict,
    dictBind,
    save
  }
}

export default useFormer
