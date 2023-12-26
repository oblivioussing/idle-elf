import { FormTypeEnum, type ListColumn as Column } from '@/chant'

export default [
  {
    prop: 'name', // 姓名
    copy: true,
    search: true
  },
  {
    prop: 'age', // 年龄
    search: true,
    type: FormTypeEnum.InputNumber
  },
  {
    prop: 'sex', // 性别
    search: true,
    type: FormTypeEnum.Select
  },
  {
    prop: 'createTime', // 创建时间
    search: true,
    type: FormTypeEnum.DateRange
  },
  {
    prop: 'updateTime', // 更新时间
    search: true,
    type: FormTypeEnum.DatetimeRange
  },
  {
    prop: 'operate', // 操作
    label: 'common.operate',
    fixed: 'right',
    slot: true,
    width: 120
  }
] as Column[]
