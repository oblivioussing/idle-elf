import { Ref } from 'vue'
import { FormType, PageEnum, TenantClassify } from '../enum'

export * from './business'

export * from './dict'

export * from './echarts'

export type Stage = 'uat' | 'demo' | 'pure' | 'prod'

export type Project = 'aimi' | 'wx' | 'zhijie'

export type FormColumn = {
  apiUrl?: string // 接口地址
  append?: string // 输入框后置内容(字段)
  appendLabel?: string // 输入框后置内容(常量)
  clearable?: boolean // 是否可清空
  attr?: any // 标签属性
  change?: (row: Ref<any>) => void // 值变更事件
  contentLineFeed?: boolean // 内容标签换行
  defaultValue?: any // 默认值
  disabled?: boolean | ((row: any) => boolean) // 是否禁用
  disabledOption?: string[] // 禁用的子项
  disabledInPage?: PageEnum // 在特定页面类型中禁用
  dynamicId?: string // 动态id字段
  dynamicCode?: string // 动态code字段
  dynamicName?: string // 动态name字段
  end?: string // 范围选择end字段
  hideInPage?: PageEnum[] // 在特定页面类型中隐藏
  hideCustom?: (row: any) => boolean // 自定义隐藏逻辑
  showCustom?: (row: any) => boolean // 自定义显示逻辑
  itemSlot?: boolean // form-item slot
  label?: string // 标签文本
  labelEn?: string // 标签文本英文
  labelZh?: string // 标签文本中文
  labelSlot?: boolean // 标签文本 slot
  lineFeed?: boolean // 是否换行
  min?: number // 最小值(只有textType为number才生效)
  max?: number // 最大值(只有textType为number才生效)
  nextRow?: boolean // 下一行
  prepend?: string // 输入框前置内容(字段)
  prependLabel?: string // 输入框前置内容(常量)
  prop: string // 字段值
  readonly?: boolean // 只读
  required?: boolean // 是否必填
  rules?: object | [] // 表单验证规则
  ignorePta?: boolean // 忽略pta规则
  slot?: boolean // 字段内容slot
  start?: string // 范围选择start字段
  tenantClassify?: TenantClassify // 租户分类
  tenantPlaceholder?: string //租户picker placeholder
  textType?: 'string' | 'number' | 'password' | 'phone-key' // 输入框文本类型
  tips?: string // 提示文本
  type?: FormType // 标签类型
  valueFormat?: string // 绑定值的格式
  width?: string // 宽度
}

export type ListColumn = {
  align?: 'left' | 'center' | 'right' // 对齐方式
  apiUrl?: string // 接口地址
  appendLabel?: string // 输入框后置内容(常量)
  clearable?: boolean // 是否可清空
  copy?: boolean // 是否可以复制
  dynamicId?: string // 动态id字段
  defaultValue?: boolean // 是否有默认值
  end?: string // 范围选择end字段
  fixed?: 'left' | 'right' // 列是否固定在左侧或者右侧
  format?: any // 格式化
  hide?: boolean // 是否隐藏
  show?: boolean // 是否显示
  label?: string // 标签文本
  labelEn?: string // 标签文本英文
  labelZh?: string // 标签文本中文
  like?: boolean // 是否为模糊查询
  link?: boolean // 是否为链接
  linkData?: any[] // 链接携带的字段
  linkParams?: (row: any) => any | Record<string, any> // 链接参数
  linkUrl?: string // 链接地址
  onlySearch?: boolean // 只作为搜索条件
  prop: string // 字段值
  start?: string // 范围选择start字段
  search?: boolean // 是否为搜索条件
  searchSlot?: boolean // 搜索条件slot
  slot?: boolean // 字段内容slot
  tagColor?: Record<string, string> // tag 颜色
  tenantClassify?: TenantClassify // 租户分类
  type?: FormType // 标签类型
  valueFormat?: string // 绑定值的格式
  width?: number // 对应列的宽度
}
