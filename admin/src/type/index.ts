import { type Ref } from 'vue'
import { FormType, PageEnum } from '../enum'

export type Stage = 'dev' | 'test' | 'prod'

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
  forceShowTenant?: boolean // 强制显示租户picker
  hideInPage?: PageEnum[] // 在特定页面类型中隐藏
  ignorePta?: boolean // 忽略pta规则
  itemSlot?: boolean // form-item slot
  label?: string // 标签文本
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
  showCustom?: (row: any) => boolean // 自定义显示逻辑
  slot?: boolean // 字段内容slot
  start?: string // 范围选择start字段
  textType?: 'string' | 'number' | 'float' | 'password' | 'phone-key' // 输入框文本类型
  tips?: string // 提示文本
  type?: FormType // 标签类型
  valueFormat?: string // 绑定值的格式
  width?: string // 宽度
}

export type ListColumn = {
  align?: 'left' | 'center' | 'right' // 对齐方式
  apiUrl?: string // 接口地址
  appendLabel?: string // 输入框后置内容
  clearable?: boolean // 是否可清空
  copy?: boolean // 是否可以复制
  dynamicId?: string // 动态id字段
  defaultValue?: boolean // 是否有默认值
  end?: string // 范围选择end字段
  fixed?: 'left' | 'right' // 列是否固定在左侧或者右侧
  forceShowTenant?: boolean // 强制显示租户picker
  format?: any // 格式化
  hide?: boolean // 是否隐藏
  show?: boolean // 是否显示
  label?: string // 标签文本
  like?: boolean // 是否为模糊查询
  link?: boolean // 是否为链接
  linkData?: any[] // 链接携带的字段
  linkParams?: (row: any) => any | Record<string, any> // 链接参数
  linkUrl?: string // 链接地址
  onlySearch?: boolean // 只作为搜索条件
  prop: string // 字段值
  search?: boolean // 是否为搜索条件
  searchSlot?: boolean // 搜索条件slot
  showCustom?: (row: any) => boolean // 自定义显示逻辑
  showCustomSlot?: (row: any) => boolean // 自定义slot显示逻辑
  slot?: boolean // 字段内容slot
  start?: string // 范围选择start字段
  tagColor?: Record<string, string> // tag 颜色
  type?: FormType // 标签类型
  valueFormat?: string // 绑定值的格式
  width?: number // 对应列的宽度
}

export type Dict = Record<string, Record<string, any>>

export type ListState = {
  allFlag?: 0 | 1 // 全选
  columns?: ListColumn[] // 列表字段
  dict?: Dict // 字典
  extraQuery: any // 额外查询条件
  jumpParams?: Record<string, any> // 页面跳转参数
  lang?: Record<string, any> // 国际化
  list: any[] // 列表数据
  loading: boolean // loading
  urlParams: Record<string, string> // url参数
  query: Record<string, any> // 查询条件
  pages: {
    pageNum: number
    pageSize: number
  } // 分页
  extra: Record<string, any> // 页面额外数据
  pageElements?: FormColumn[] // 定义字段
  resultDict: Record<string, any> // 字典初始值
  selectionId: string // 选中的id
  selectionRow: any // 选中的行
  selectionIdList: string[] // 选中的idList
  selectionList: any[] // 选中列表数据
  total: number // 总数
  [key: string]: any
}

export type PageRelation = Record<string, { parent: string }>

export type ListParams = {
  idList?: string[]
  allFlag?: number
  searchAllForm?: Record<string, any>
}
