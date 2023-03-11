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
// 实体转化
export function toEntity<T>(data: Record<string, any>, entity: T): T {
  const obj = {} as T
  for (const item in data) {
    if (entity.hasOwnProperty(item)) {
      if (data[item] === null) {
        obj[item] = entity[item]
      } else {
        obj[item] = data[item]
      }
    }
  }
  return obj
}
