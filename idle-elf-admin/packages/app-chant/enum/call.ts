// 坐席状态
export enum AgentStatus {
  NotLogin = '0', // 未登陆
  Idle = '3', // 在线空闲
  Conversation = '5', // 通话
  Ringing = '9' // 振铃
}
// 呼入状态
export enum InboundStatus {
  Idle = '3', // 在线空闲
  Vacationette = '4', // 小休
  Conversation = '5', // 通话
  Transaction = '8', // 事务处理
  Dinner = '21', // 用餐
  Train = '22', // 培训
  Restroom = '23', // 洗手间
  vacation = '24' // 休假
}
// 呼叫方向
export enum DirectionType {
  Out = '1', // 呼出
  Incoming = '2', // 呼入
  InternalCall = '3' // 内部呼叫
}
// 业务类型
export enum InboundType {
  Collection = '10', // 催收
  Visit = '11', // 回访
  Market = '12', // 营销
  Notice = '13', // 通知
  Debt = '14', // 债务
  Complaint = '15', // 投诉
  Seek = '16' // 咨询
}
// 跟进类型
export enum FollowUpType {
  AiToManual = '14', // AI转人工
  HumanOutbound = '15', // 人工外呼
  Standard = '16' // 标准呼入
}
// 跟进数据类型
export enum FollowUpDataType {
  Direct = '10', // 直接
  Customer = '11', // 客户
  Case = '12', // 案件
  DebtOrder = '13', // 协商
  CustomerContactPhone = '14', // 客户联系电话
  CaseContactPhone = '15' // 案件联系电话
}
// 工作台类型
export enum WorkbenchType {
  Collection = 'collection', // 电催
  CollectionComing = 'collectionComing', // 催收呼入
  Customer = 'customer', // 客户
  CustomerService = 'customerService' // 客服
}
