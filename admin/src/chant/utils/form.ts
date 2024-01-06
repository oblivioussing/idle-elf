import type { DatePickType } from 'element-plus'

export default {
  // 是否为daterange
  isDateRange(type?: DatePickType) {
    if (type) {
      const list: DatePickType[] = ['daterange', 'datetimerange', 'monthrange']
      return list.includes(type)
    }
  }
}
