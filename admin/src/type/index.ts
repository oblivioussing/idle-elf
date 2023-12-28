export type Stage = 'dev' | 'test' | 'prod'

export type PageRelation = Record<string, { parent: string }>

export type ListParams = {
  idList?: string[]
  allFlag?: number
  searchAllForm?: Record<string, any>
}
