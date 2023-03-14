import { FormType, Format } from '../../../enum'
import { ListColumn as Column } from '../../../type'

export default [
  {
    prop: 'name' // 任务名称
  },
  {
    prop: 'speechName' // 话术名称
  },
  {
    prop: 'businessScenario', // 业务场景：10-催收;11-回访;12-营销;13-通知
    type: FormType.Select,
    format: Format.Dict
  },
  {
    prop: 'status', // 任务状态：10-导入中；11-待发布；12-发布中；13-运行中；14-暂停；15-完成；99-失败
    type: FormType.Select,
    format: Format.Dict
  },
  {
    prop: 'isRecall', // 是否重呼：0-否；1-是；
    type: FormType.Select,
    format: Format.Dict
  },
  {
    prop: 'totalCount' // 外呼名单总数
  },
  {
    prop: 'createTime', // 创建时间
    label: 'common.createTime',
    format: Format.Datetime
  }
] as Column[]
