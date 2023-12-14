import { FormType } from '@/enum'
import { type FormColumn as Column } from '@/type'

export default [
  {
    label: '姓名',
    prop: 'name',
    required: true
  },
  {
    label: '年龄',
    prop: 'age',
    required: true
  }
] as Column[]
