import { FormType, Format } from '../../../enum'
import { ListColumn as Column } from '../../../type'

export default [
  {
    prop: 'speechCode', // 话术编号
    search: true
  },
  {
    prop: 'speechName', // 话术名称
    search: true
  },
  {
    prop: 'remark', // 话术描述
    search: true
  },
  {
    prop: 'releaseFlag', // 是否发布：0-否；1-是；
    type: FormType.Select,
    format: Format.Dict,
    search: true
  },
  {
    prop: 'status', // 话术状态：11-待审核；12-审核中；13-审核通过；99-审核未通过；
    type: FormType.Select,
    format: Format.Dict,
    search: true
  },
  {
    prop: 'createByName' // 创建人
  },
  {
    prop: 'updateTime', // 最近更新时间
    type: FormType.Datetimerange,
    format: Format.Datetime,
    search: true
  }
] as Column[]
