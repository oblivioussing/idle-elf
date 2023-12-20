import dayjs from 'dayjs'

export default {
  // 日期
  date(val: string) {
    if (val) {
      return dayjs(parseInt(val)).format('YYYY-MM-DD')
    }
  },
  // 日期时间
  datetime(val: string | number) {
    if (val) {
      return dayjs(Number(val)).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  // 金额
  money(val: string | number) {
    if (val) {
      return Math.floor(Number(val) * 100) / 100
    } else {
      return 0
    }
  },
  // 千分位
  thousand(val: string | number) {
    if (val) {
      val = Number(val).toFixed(2).toString()
      return val.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  // 隐藏手机中间4位
  hidePhone(val: string | number) {
    if (val) {
      return val.toString().replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')
    }
  },
  // 手机号码分段
  mobileCut(val: string) {
    let tpl = ''
    for (let i = 0; i < val.length; i++) {
      if (i == 2 || i == 6) {
        tpl = tpl + val.charAt(i) + ' '
      } else {
        tpl = tpl + val.charAt(i)
      }
    }
    return tpl
  }
}
