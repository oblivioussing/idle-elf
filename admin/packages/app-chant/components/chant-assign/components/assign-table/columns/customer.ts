import { ListColumn as Column } from '@chant/type'

export default [
  {
    prop: 'targetOrgName' // 部门名称
  },
  {
    prop: 'postOrgName' // 岗位名称
  },
  {
    prop: 'targetUserInfoName' // 员工姓名
  },
  {
    prop: 'prepareAssignNum' // 分配数
  },
  {
    prop: 'operate', // 操作
    label: 'common.operate',
    fixed: 'right',
    slot: true,
    width: 80
  }
] as Column[]
