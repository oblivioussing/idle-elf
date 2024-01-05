import type { DatePickType } from 'element-plus'
import { type ListColumn, type FormColumn } from '@/chant'

type Column = ListColumn | FormColumn

export default {
  // 是否为input
  isInput(row: Column) {
    return !row.type || row.type === 'input'
  },
  // 是否为daterange
  isDateRange(row: Column) {
    if (row.datepickerType) {
      const list: DatePickType[] = ['daterange', 'datetimerange']
      return list.includes(row.datepickerType)
    }
  }
}
