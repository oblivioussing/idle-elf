import { ElMessageBox } from 'element-plus'

const element = {
  // 确认消息
  async confirm(
    msg: string,
    options?: { confirm?: string; cancel?: string; title?: string }
  ) {
    try {
      const confirmButtonText = options?.confirm || '确认'
      const cancelButtonText = options?.cancel || '取消'
      const ret = await ElMessageBox.confirm(msg, options?.title, {
        confirmButtonText,
        cancelButtonText,
        type: 'warning'
      })
      return !!ret
    } catch (error) {
      return false
    }
  }
}

export default element
