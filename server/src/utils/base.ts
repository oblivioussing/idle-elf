import { customAlphabet } from 'nanoid'
import { decrypt } from '../share/crypto'

// 创建id
export function createId() {
  const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 20)
  return nanoid()
}
// 创建uid
export function createUid() {
  const nanoid = customAlphabet('1234567890', 20)
  return nanoid()
}
// 获取北京时间
export function getChinaDate() {
  return new Date(new Date().getTime() + 28800000)
}
// 根据token获取uid
export function getUidByToken(token: string) {
  const [iv, hash] = token?.split('.') || []
  if (iv && hash) {
    return decrypt(iv, hash)
  } else {
    return ''
  }
}
// 是否为Date
export function isDate(value: any) {
  return value instanceof Date
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
