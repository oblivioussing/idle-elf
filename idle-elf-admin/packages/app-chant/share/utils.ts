type CustomerName = 'jingzhong' | 'yunke'

export default {
  // 获取客户名称
  getCustomerName(): CustomerName | undefined {
    if (typeof window === 'undefined') {
      return undefined
    }
    const list = ['jingzhong', 'yunke'] as CustomerName[]
    return list.find((item) => {
      return location.href.indexOf(item) >= 0
    })
  }
}
