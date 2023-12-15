import { FormType } from '@/enum'
import { type ListColumn as Column } from '@/type'

export default [
  {
    prop: 'name', // 姓名
    slot: true
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
  }
] as Column[]
