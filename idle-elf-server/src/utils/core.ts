import { Page } from '@/type'

// 分页
export function pageHelper(page: Page) {
  const { pageNum, pageSize } = page || {}
  return {
    skip: (pageNum - 1) * pageSize,
    take: pageSize
  }
}
