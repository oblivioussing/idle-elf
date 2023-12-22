import { FormTypeEnum } from '@/chant'
import { type FormColumn as Column } from '@/type'

export default [
  {
    prop: 'name', // 姓名
    required: true
  },
  {
    prop: 'age', // 年龄
    required: true
  },
  {
    prop: 'sex', // 性别
    required: true,
    type: FormTypeEnum.Select
  }
] as Column[]
