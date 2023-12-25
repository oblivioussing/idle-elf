import { FormTypeEnum, type ListColumn, type FormColumn } from '@/chant'

type Column = ListColumn | FormColumn

export default {
  // 是否为input
  isInput(row: Column) {
    return (
      !row.type ||
      [FormTypeEnum.Input, FormTypeEnum.Textarea].includes(row.type)
    )
  },
  // 是否为date
  isDate(row: Column) {
    if (row.type) {
      return [
        FormTypeEnum.Date,
        FormTypeEnum.Datetime,
        FormTypeEnum.Month
      ].includes(row.type)
    }
  },
  // 是否为daterange
  isDateRange(row: Column) {
    if (row.type) {
      return [
        FormTypeEnum.DateRange,
        FormTypeEnum.DatetimeRange,
        FormTypeEnum.MonthRange
      ].includes(row.type)
    }
  }
}
