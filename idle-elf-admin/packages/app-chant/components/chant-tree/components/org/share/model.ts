import { FormType, PageEnum } from '@chant/enum'
import { FormColumn as Column } from '@chant/type'
import { BizLine, OrgType } from './enum'

export default [
  {
    prop: 'parentCode', // 父机构编号
    disabled: true
  },
  {
    prop: 'parentName', // 父机构名称
    disabled: true
  },
  {
    prop: 'orgName', // 机构名称,岗位名称
    required: true,
    labelSlot: true
  },
  {
    prop: 'aliasName', // 机构别名,岗位别名
    labelSlot: true
  },
  {
    prop: 'level', // 层级
    disabled: true
  },
  {
    prop: 'serialNo' // 序号
  },
  {
    prop: 'orgType', // 节点类型
    type: FormType.Select,
    disabled: true
  },
  {
    prop: 'bizLine', // 业务线
    required: true,
    type: FormType.Select,
    disabledInPage: PageEnum.Edit,
    showCustom(row) {
      // 岗位才显示
      return row.orgType === OrgType.Post
    }
  },
  {
    prop: 'dataPermission', // 数据权限
    required: true,
    type: FormType.Select,
    showCustom(row) {
      // 业务线为非无才显示
      return row.bizLine && row.bizLine !== BizLine.Not
    }
  }
] as Column[]
