import {
  AssignOperateType,
  AssignType,
  CaseDataType,
  Hierarchy
} from '@chant/enum'

export { default as lang } from './lang'

export type InfoData = {
  prepareAssignUrl?: string // 预分配api地址
  prepareTransferUrl?: string // 预转移api地址
  totalCaseNum?: number // 案件数
  totalEntrustAmount?: number // 委案总金额
  deptId?: string // 部门id
  deptName?: string // 部门名称
  defaultValue?: Record<string, any> // 默认值
  tenantId?: string // 租户id
  tenantName?: string // 租户名称
  dict?: Record<string, any> // 字典
  hierarchy?: Hierarchy // 层级
  caseDataType?: CaseDataType // 案件类型
  idList?: string[] // 选中的id列表
  assignOperateType?: AssignOperateType // 操作类型 分配/转移
  showDepartment?: boolean // 显示部门
  assignType?: AssignType // 分配类型
  allFlag?: number // 是否全选
  searchAllForm?: Record<string, any> // 页面搜索条件
}
