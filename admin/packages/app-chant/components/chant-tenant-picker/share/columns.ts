import { FormType, Format } from '../../../enum'
import { ListColumn as Column } from '../../../type'

export default [
  {
    prop: 'tenantName', // 租户名称
    search: true
  },
  {
    prop: 'tenantCode', // 租户编号
    search: true
  },
  {
    prop: 'tenantType', // 租户类型
    format: Format.Dict,
    search: true,
    type: FormType.Select
  },
  {
    prop: 'tenNo', // 租户标识
    search: true
  },
  {
    prop: 'status', // 状态
    format: Format.Dict,
    search: true,
    type: FormType.Select
  },
  {
    prop: 'tenantPrefix', // 登录名前缀
    search: true
  },
  {
    prop: 'owner', // 户主
    search: true
  },
  {
    prop: 'ownerPhone', // 户主手机号
    search: true
  },
  {
    prop: 'ownerLoginName' // 户主登录名
  },
  {
    prop: 'privatizationFlag' // 是否私有化
  }
] as Column[]
