import { FormType } from '@chant/enum'
import { FormColumn as Column } from '@chant/type'

export default [
  {
    prop: 'assignBatchName' // 回收批次名称
    // required: true
  },
  {
    prop: 'recoveryTime', // 自动回收时间
    // required: true,
    slot: true
  }
] as Column[]
