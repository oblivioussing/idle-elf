import { FormTypeEnum, type FormColumn as Column } from '@/chant'

export default [
  {
    prop: 'name', // 姓名
    required: true
  },
  {
    prop: 'age', // 年龄
    required: true,
    type: FormTypeEnum.InputNumberRange
  },
  {
    prop: 'sex', // 性别
    required: true,
    type: FormTypeEnum.Select
  },
  {
    prop: 'createTime', // 创建时间
    type: FormTypeEnum.DatetimeRange
  },
  {
    prop: 'remark', // 备注
    type: FormTypeEnum.Textarea
  }
] as Column[]
