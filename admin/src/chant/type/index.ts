import { type Ref } from 'vue'
import { FormatEnum, FormTypeEnum, PageTypeEnum } from '@/chant'

export type Dict = Record<string, Record<string, any>>

export type FormColumn = {
  append?: string // 输入框后置内容
  clearable?: boolean // 是否可清空
  change?: (row: any) => void // 值变更事件
  defaultValue?: any // 默认值
  disabled?: boolean | ((row: any) => boolean) // 是否禁用
  disabledInPage?: PageTypeEnum // 在特定页面类型中禁用
  dynamicId?: string // 动态id字段
  dynamicStart?: string // 范围选择start字段
  dynamicEnd?: string // 动态范围选择end字段
  hide?: boolean // 是否隐藏
  hideInPage?: PageTypeEnum // 在特定页面类型中隐藏
  label?: string // 标签文本
  lineFeed?: boolean // 是否换行
  prepend?: string // 输入框前置内容
  prop: string // 字段值
  required?: boolean // 是否必填
  rows?: number // 输入框行数,仅 type 为'textarea'时有效
  rules?: any[] // 表单验证规则
  selectMultiple?: boolean // select是否多选
  showCustom?: (row: any) => boolean // 自定义显示逻辑
  slot?: boolean // 字段内容slot
  title?: string // 标题
  type?: FormTypeEnum // 标签类型
  valueFormat?: string // 绑定值的格式
}

export type ListColumn = {
  append?: string // 输入框后置内容
  clearable?: boolean // 是否可清空
  copy?: boolean // 是否可以复制
  dynamicId?: string // 动态id字段
  dynamicStart?: string // 范围选择start字段
  dynamicEnd?: string // 动态范围选择end字段
  editable?: boolean // 是否可编辑
  fixed?: 'left' | 'right' // 列是否固定在左侧或者右侧
  format?: FormatEnum // 格式化
  hide?: boolean // 是否隐藏
  label?: string // 标签文本
  like?: boolean // 是否为模糊查询
  onlySearch?: boolean // 只作为搜索条件
  prepend?: string // 输入框前置内容
  prop: string // 字段值
  search?: boolean // 是否为搜索条件
  searchSlot?: boolean // 搜索条件slot
  slot?: boolean // 字段内容slot
  tagColor?: Record<string, string> // tag 颜色
  type?: FormTypeEnum // 标签类型
  valueFormat?: string // 绑定值的格式
  width?: number // 对应列的宽度
}

export type ListState = {
  allFlag?: 0 | 1 // 全选
  columns: ListColumn[] // 列表字段
  dict?: Dict // 字典
  extra: Record<string, any> // 页面额外数据
  keepQuery: Record<string, any> // 持续存在的查询条件
  lang?: Record<string, any> // 国际化
  list: any[] // 列表数据
  loading: boolean // loading
  query: Record<string, any> // 查询条件
  pages: {
    pageNum: number
    pageSize: number
  } // 分页
  selectionRow: any // 选中的行
  selectionList: any[] // 选中列表数据
  total: number // 总数
  [key: string]: any
}
