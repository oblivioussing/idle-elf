import { Format } from '../../../enum'
import { ListColumn as Column } from '../../../type'

export default [
  {
    prop: 'prodName', // 产品名称
    search: true
  },
  {
    prop: 'prodCode' // 产品编码
  },
  {
    prop: 'interestRate' // 产品利率
  },
  {
    prop: 'status', // 产品状态
    format: Format.Dict
  },
  {
    prop: 'stageFlag', // 是否分期
    format: Format.Dict
  },
  {
    prop: 'stageType', // 分期类型
    format: Format.Dict
  },
  {
    prop: 'repaymentMethod', // 还款方式
    format: Format.Dict
  }
] as Column[]
