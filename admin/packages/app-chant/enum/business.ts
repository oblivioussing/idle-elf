// 租户类型
export enum TenantClassify {
  AgentTenant = 'agentTenant', // 人工外呼租户
  AiTenant = 'aiTenant', // 智能语音租户
  Entrust = 'entrust', // 资产方
  MasterWorkPlace = 'masterWorkPlace', // 集团职场
  MasterSingleWorkPlace = 'masterSingleWorkPlace', // 所属职场
  Organization = 'organization', // 组织
  SaasCustomer = 'saasCustomer', // 公有云客户
  Supplier = 'supplier', // 供应商
  Tenant = 'tenant', // 租户
  Workplace = 'workplace', // 职场
  WorkplaceTemplate = 'workplaceTemplate' // 模板职场
}
// 分配类型
export enum AssignType {
  Workplace = '13', // 职场
  Department = '15', // 部门
  Personal = '16' // 个人
}
// 分配操作类型
export enum AssignOperateType {
  Assign = 'assign', // 分配
  Transfer = 'transfer' // 转移
}
// 分配种类
export enum AssignKind {
  Case = 'case', // 案件
  Customer = 'customer' // 客户
}
// 层级
export enum Hierarchy {
  Platform = '11', // 平台
  PlatformAssignBatch = '12', // 平台分配批次
  Tenant = '13', // 职场
  Org = '15', // 部门
  User = '16' // 个人
}
// 案件类型
export enum CaseDataType {
  Case = '11', // 案件
  CaseBatch = '12' // 案件批次
}
// 系统类型
export enum SysCode {
  Platform = '10', // 平台
  Admin = '11' // 后台
}
// 功能类型
export enum FunType {
  System = '10', // 系统
  Function = '11', // 功能
  Page = '12', // 页面
  Global = '20', // 全局功能
  FirstLevelMenu = '30', // 一级菜单
  SecondLevelMenu = '31', // 二级菜单
  RemoteMenu = '32' // 远程菜单
}
// 职场类型
export enum WorkplaceTypeEnum {
  Headquarters = '11', // 集团总部
  Group = '12', // 集团职场
  Independent = '13' // 独立职场
}
// 队列类型
export enum QueueType {
  Tel = '11', // 电催
  Law = '12', // 法催
  Customer = '13' // 客户
}
// 号码来源类型
export enum PhoneSourceType {
  Case = '11', // 案件
  Debtor = '12', // 债务人
  Customer = '15', // 客户
  ContactPhone = '16' // 联系电话
}
