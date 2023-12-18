import { FormType } from '@/enum'
import { type ListColumn as Column } from '@/type'

export default [
  {
    prop: 'name', // 姓名
    search: true
  },
  {
    prop: 'age', // 年龄
    search: true,
    type: FormType.Range
  },
  {
    prop: 'sex', // 性别
    search: true,
    type: FormType.Select
  },
  {
    prop: 'createTime', // 创建时间
    search: true,
    type: FormType.Datetimerange
  }
] as Column[]
