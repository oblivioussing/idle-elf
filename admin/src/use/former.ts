import type { FormInstance } from 'element-plus'
import { onActivated } from 'vue'
import { useRoute } from 'vue-router'
import shiki from '@/api/shiki'
import { type FormColumn as Column } from '@/chant'
import { bus, core } from '@/utils'

type State = {
  continueAdd?: boolean
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
}

function useFormer() {
  const route = useRoute()
  const state = {
    continueAdd: false,
    dict: {} as any,
    form: {} as any,
    formLoading: false,
    lang: {},
    loading: false,
    model: [],
    query: {} as any
  }
  let formInstance: FormInstance

  // 绑定表单实例
  function bindInstance(val: FormInstance) {
    formInstance = val
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
  async function getData(path: string, state: State) {
    state.formLoading = true
    const { data } = await shiki?.getData(path, state.query)
    state.formLoading = false
    state.form = data
  }
  // 刷新列表
  function refresh() {
    const path = core.getParentPath(route?.path)
    if (path) {
      bus.emit(path)
    }
  }
  // 保存
  async function save(path: string, state: State, config?: { params?: any }) {
    // 表单校验
    const status = await validate()
    if (!status) {
      return false
    }
    const params = config?.params || state.form
    state.loading = true
    const code = await shiki?.postCode(path, params)
    state.loading = false
    if (!shiki?.isSuccess(code)) {
      return false
    }
    // 是否继续新增
    if (state.continueAdd) {
      state.form = {}
      formInstance.resetFields()
      return true
    }
    // 刷新列表
    refresh()
    // 关闭页面
    core.closePage()
    return true
  }
  // 表单校验
  async function validate() {
    return await formInstance.validate()
  }

  return {
    state,
    bindInstance,
    created,
    getData,
    save
  }
}

export default useFormer
