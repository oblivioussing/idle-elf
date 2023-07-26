import { ListColumn as Column } from '../../../type'

export default [
  {
    prop: 'tenantName' // 职场名称
  },
  {
    prop: 'userInfoName', // 员工姓名
    search: true
  },
  {
    prop: 'positionName' // 岗位
  },
  {
    prop: 'phoneNum', // 手机号
    search: true
  },
  {
    prop: 'userInfoCode' // 员工号
  }
] as Column[]
