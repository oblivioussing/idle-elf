import { ListColumn as Column } from './index'

export type Dict = Record<string, Record<string, any>>

export type Tenant = {
  sysCode?: string
  tenantId?: string
  tenantName?: string
}

export type ListState = {
  allFlag?: 0 | 1 // 全选
  columns?: Column[] // 列表字段
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
  pageElements?: Column[] // 定义字段
  resultDict: Record<string, any> // 字典初始值
  selectionId: string // 选中的id
  selectionRow: any // 选中的行
  selectionIdList: string[] // 选中的idList
  selectionList: any[] // 选中列表数据
  tenant?: Tenant // 租户相关数据
  total: number // 总数
  [key: string]: any
}

export type PageRelation = Record<string, { parent: string }>

export type ListParams = {
  idList?: string[]
  allFlag?: number
  searchAllForm?: Record<string, any>
}
