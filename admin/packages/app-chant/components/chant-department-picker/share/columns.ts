import { Format } from '@chant/enum'
import { ListColumn as Column } from '@chant/type'

export default [
  {
    prop: 'orgName', // 部门名称
    search: true
  },
  {
    prop: 'orgCode', // 部门编号
    search: true
  }
] as Column[]
