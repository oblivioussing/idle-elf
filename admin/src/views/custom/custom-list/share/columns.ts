import { FormType } from '@/enum'
import { type ListColumn as Column } from '@/type'

export default [
  {
    label: '姓名',
    prop: 'name',
    slot: true
  },
  {
    label: '年龄',
    prop: 'age',
    search: true,
    type: FormType.Range
  }
] as Column[]