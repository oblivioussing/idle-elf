import { ListColumn as Column } from '@chant/type'

export default [
  {
    prop: 'targetOrgName', // 部门名称
    width: 120
  },
  {
    prop: 'postOrgName' // 岗位名称
  },
  {
    prop: 'targetUserInfoName', // 员工姓名
    width: 90
  },
  {
    prop: 'currentStockNum' // 存量案件数
  },
  {
    prop: 'currentStockMoney' // 存量案件金额
  },
  {
    prop: 'prepareAssignNum' // 分配数
  },
  {
    prop: 'prepareAssignMoney' // 分配案件金额
  },
  {
    prop: 'totalNum' // 分配后总数
  },
  {
    prop: 'totalMoney' // 分配后总金额
  },
  {
    prop: 'operate', // 操作
    label: 'common.operate',
    fixed: 'right',
    slot: true,
    width: 80
  }
] as Column[]
