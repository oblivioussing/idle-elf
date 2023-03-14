import { FormType, Format } from '@chant/enum'
import { ListColumn as Column } from '@chant/type'

export default [
  {
    prop: 'customerName', //客户姓名
    search: true
  },
  {
    prop: 'phone', // 客户手机
    search: true
  },
  {
    prop: 'company', // 合同签署主体
    search: true
  },
  {
    prop: 'gender', // 客户性别
    format: Format.Dict
  },
  {
    prop: 'customerStage', // 客户阶段
    format: Format.Dict,
    type: FormType.Select
  },
  {
    prop: 'level', // 客户层级
    format: Format.Dict,
    type: FormType.Select
  },
  {
    prop: 'lastCallTime', // 最近一次通话时间
    format: Format.Datetime,
    start: 'lastCallTimeStartDate',
    end: 'lastCallTimeEndDate',
    type: FormType.Datetimerange
  },
  {
    prop: 'belongUserInfoName' // 客户经理
  }
] as Column[]
