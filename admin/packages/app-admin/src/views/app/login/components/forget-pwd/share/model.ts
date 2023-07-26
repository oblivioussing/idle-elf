import { FormType } from 'chant/enum'
import { FormColumn as Column } from 'chant/type'

export default [
  {
    prop: 'signature', // 验证码
    type: FormType.Textarea,
    attr: { rows: 4 }
  },
  {
    prop: 'password', // 新密码
    attr: {
      type: 'password'
    }
  },
  {
    prop: 'confirmPassword', // 确认密码
    attr: {
      type: 'password'
    }
  }
] as Column[]
