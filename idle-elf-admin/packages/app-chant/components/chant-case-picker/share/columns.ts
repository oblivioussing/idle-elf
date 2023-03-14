import { FormType, Format, TenantClassify } from '@chant/enum'
import { ListColumn as Column } from '@chant/type'

export default [
  {
    prop: 'caseTag', // 标签
    search: true,
    format: Format.Dict,
    type: FormType.Select
  },
  {
    prop: 'workOrderCode', // 案件编号
    search: true,
    width: 240
  },
  {
    prop: 'owosn', // 资产方个案号
    search: true
  },
  {
    prop: 'customerName', // 姓名
    search: true
  },
  {
    prop: 'phone', // 手机号
    search: true
  },
  {
    prop: 'idCard', // 证件号码
    search: true
  },
  {
    prop: 'overdueDays', // 逾期天数
    search: true,
    type: FormType.Range,
    appendLabel: 'unit.day'
  },
  {
    prop: 'followUpTime', // 最近一次跟进时间
    format: Format.Datetime
  },
  {
    prop: 'collectionRecordStatus', // 催记跟进状态
    format: Format.Dict
  },
  {
    prop: 'priority', // 优先级
    search: true,
    type: FormType.Select,
    format: Format.Dict
  },
  {
    prop: 'complaintRisk', // 投诉风险
    search: true,
    type: FormType.Select,
    format: Format.Dict
  },
  {
    prop: 'confirmRepaymentAmount', // 确认还款金额
    appendLabel: 'unit.yuan'
  },
  {
    prop: 'entrustTenantName', // 资产方
    label: 'common.entrust',
    type: FormType.TenantPicker,
    tenantClassify: TenantClassify.Entrust,
    dynamicId: 'entrustTenantId',
    dynamicName: 'entrustTenantName',
    search: true
  },
  {
    prop: 'batchCode', // 批次号
    search: true
  },
  // {
  //   prop: 'batchName', // 批次名称
  //   search: true
  // },
  {
    prop: 'owobsn', // 资产方批次号
    search: true
  },
  {
    prop: 'productName', // 产品名称
    search: true,
    type: FormType.ProductPicker
  },
  {
    prop: 'idCard', // 证件号码
    search: true
  },
  {
    prop: 'entrustAmount', // 委案金额
    appendLabel: 'unit.yuan'
  },
  {
    prop: 'lateCharge' // 案件罚息
  },
  {
    prop: 'entrustBalance', // 委案余额
    appendLabel: 'unit.yuan'
  },
  {
    prop: 'overdueStage', // 逾期阶段
    search: true,
    type: FormType.Select
  },
  {
    prop: 'assignByName' // 分配人
  },
  {
    prop: 'belongTenantName' // 职场
  },
  {
    prop: 'belongOrgName' // 职场部门
  },
  {
    prop: 'belongOrgTime', // 分配部门时间
    format: Format.Datetime
  },
  {
    prop: 'belongUserInfoName' // 催收员
  },
  {
    prop: 'belongUserInfoTime', // 分配催员时间
    format: Format.Datetime
  },
  // {
  //   prop: 'retainTimes' // 留案次数
  // },
  {
    prop: 'recoveryTime', // 回收时间
    format: Format.Date
  },
  {
    prop: 'score' // 评分
  },
  {
    prop: 'entrustReturnTime', // 退案时间
    search: true,
    format: Format.Date,
    type: FormType.Daterange
  },
  {
    prop: 'caseStatus', // 案件状态
    search: true,
    fixed: 'right',
    format: Format.Dict,
    type: FormType.Select,
    width: '100px'
  },
  {
    prop: 'wodStatus', // 案件阶段
    search: true,
    fixed: 'right',
    format: Format.Dict,
    type: FormType.Select,
    width: '100px'
  }
] as Column[]
