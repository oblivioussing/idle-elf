import { FormColumn as Column } from 'chant/type'

export default [
  {
    prop: 'loginName' // 登录名
  },
  {
    prop: 'password', // 原密码
    attr: {
      type: 'password'
    },
    showCustom(row) {
      return row.nup === '1'
    }
  },
  {
    prop: 'newPassword', // 新密码
    attr: {
      type: 'password'
    },
    showCustom(row) {
      return row.nup === '1'
    }
  },
  {
    prop: 'confirmPassword', // 确认密码
    attr: {
      type: 'password'
    },
    showCustom(row) {
      return row.nup === '1'
    }
  },
] as Column[]
