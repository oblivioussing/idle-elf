export default {
  // 手机号码
  isPhone(phone: string | number) {
    const reg = /^[1][3456789][0-9]{9}$/
    return reg.test(phone.toString())
  },
  // 身份证号码
  isIdentityCar(id: string) {
    const reg =
      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return reg.test(id)
  },
  // 邮箱
  isEmail(email: string) {
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    return reg.test(email)
  },
  // url
  isUrl(url: string) {
    const reg =
      /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    return reg.test(url)
  },
  // 整数
  isInteger(num: number) {
    const reg = /^[-+]?\d*$/
    return reg.test(num.toString())
  },
  // 小数
  isDecimal(num: number) {
    const reg = /^[-\+]?\d+(\.\d+)?$/
    return reg.test(num.toString())
  }
}
