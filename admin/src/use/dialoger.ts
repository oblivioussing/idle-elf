import { getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import shiki from '../api/shiki'
import { bus } from '../utils'

type State = {
  form?: object
  loading: boolean
  formLoading?: boolean
}

function useDialoger() {
  const instance = getCurrentInstance()
  const route = useRoute()
  // 关闭
  function close() {
    instance?.emit('update:modelValue', false)
  }
  // 保存
  async function save(
    path: string,
    state: State,
    config?: {
      eventBus?: boolean
      params?: any
    }
  ) {
    state.loading = true
    const code = await shiki?.postCode(path, config?.params || state.form)
    state.loading = false
    if (shiki?.isSuccess(code)) {
      // 关闭
      close()
      // 通知
      if (config?.eventBus !== false) {
        bus.emit(route.path)
      }
      instance?.emit('update')
    }
  }
  return { close, save }
}

export default useDialoger
