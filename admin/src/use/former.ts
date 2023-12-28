import type { FormInstance } from 'element-plus'
import { getCurrentInstance, onActivated } from 'vue'
import { useRoute } from 'vue-router'
import shiki from '@/api/shiki'
import { type FormColumn as Column } from '@/chant'
import { ApiCode } from '@/enum'
import { bus, core } from '@/utils'

type State = {
  continueAdd?: boolean
  form: {
    pageElements?: Column[]
    [key: string]: any
  }
  formLoading: boolean
  loading: boolean
  query: Record<string, any>
}
type Config = { type?: 'page' | 'dialog' }

function useFormer(formConfig = { type: 'page' } as Config) {
  let formInstance: FormInstance
  const instance = getCurrentInstance()
  const route = useRoute()
  const state = {
    continueAdd: false,
    form: {} as any,
    formLoading: false,
    loading: false,
    query: {} as any
  }
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
    if (code !== ApiCode.Success) {
      return false
    }
    // 是否继续新增
    if (state.continueAdd) {
      state.form = {}
      formInstance.resetFields()
      return true
    }
    if (formConfig.type === 'page') {
      // 刷新列表
      const path = core.getParentPath(route?.path)
      bus.emit(path)
      // 关闭页面
      core.closePage()
    } else {
      const emitsOptions = (instance as any)?.emitsOptions
      if (emitsOptions?.hasOwnProperty('update')) {
        instance?.emit('update')
      }
      instance?.emit('update:modelValue', false)
    }
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
