import { ListColumn as Column } from '@chant/type'

export default [
  {
    prop: 'targetName' // 职场名称
  },
  {
    prop: 'prepareAssignNum' // 分配案件数
  },
  {
    prop: 'prepareAssignMoney' // 分配案件金额
  },
  // {
  //   prop: 'totalNum' // 分配后总数
  // },
  // {
  //   prop: 'totalMoney' // 分配后总金额
  // },
  {
    prop: 'operate', // 操作
    label: 'common.operate',
    slot: true,
    width: 80
  }
] as Column[]
