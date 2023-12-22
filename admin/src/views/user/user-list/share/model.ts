import { FormTypeEnum, type FormColumn as Column } from '@/chant'

export default [
  {
    prop: 'name', // 姓名
    required: true
  },
  {
    prop: 'age', // 年龄
    required: true,
    type: FormTypeEnum.InputNumber
  },
  {
    prop: 'sex', // 性别
    required: true,
    type: FormTypeEnum.Select
  },
  {
    prop: 'createTime', // 创建时间
    type: FormTypeEnum.Datetime
  }
] as Column[]
