import { Page } from '@/type'
import { isDate } from './base'

// 分页
export function pageHelper(page: Page) {
  const { pageNum, pageSize } = page || {}
  return {
    skip: (pageNum - 1) * pageSize,
    take: pageSize
  }
}
// 实体转化
export function toEntity<T>(data: Record<string, any>, entity: T): T {
  const obj = {} as T
  for (const item in data) {
    if (entity.hasOwnProperty(item)) {
      const entityValue = entity[item]
      const dataValue = data[item]
      if (isDate(entityValue)) {
        if (dataValue) {
          obj[item] = new Date(dataValue)
        } else {
          obj[item] = null
        }
      } else if (dataValue === null) {
        obj[item] = entityValue
      } else if (typeof entityValue === 'number') {
        obj[item] = Number(dataValue)
      } else if (typeof entityValue === 'string') {
        obj[item] = String(dataValue)
      } else {
        obj[item] = dataValue
      }
    }
  }
  return obj
}
