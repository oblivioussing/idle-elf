import { type ElForm, ElMessageBox } from 'element-plus'

type FormInstance = InstanceType<typeof ElForm>

const element = {
  // 确认输入内容
  async prompt(options: any) {
    try {
      const ret = await ElMessageBox.prompt(options.content, options.title, {
        inputErrorMessage: options?.inputErrorMessage,
        inputPattern: options?.inputPattern,
        inputType: options?.inputType || 'textarea',
        inputValue: options?.inputValue,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
      return ret.value
    } catch (error) {
      return false
    }
  },
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
  },
  // 表单校验
  async validate(ref: FormInstance) {
    return new Promise((resolve) => {
      ref.validate((valid) => {
        resolve(valid)
      })
    })
  },
  // 验证具体的某个字段
  async validateField(ref: FormInstance, prop: string) {
    return new Promise((resolve) => {
      ref.validateField(prop, (valid) => {
        resolve(valid)
      })
    })
  }
}

export default element
