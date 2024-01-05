import { ElementTypeEnum, type Column } from '@/chant'

export default () => {
  return [
    {
      prop: 'loginName',
      label: '用户名',
      search: true
    },
    {
      prop: 'name',
      label: '姓名',
      search: true
    },
    {
      prop: 'gender',
      label: '性别',
      search: true,
      type: ElementTypeEnum.Select
    },
    {
      prop: 'status', // 状态
      label: '状态',
      search: true,
      tagType: {
        1: 'success',
        2: 'danger',
        3: 'warning'
      },
      type: ElementTypeEnum.Select
    },
    {
      prop: 'email',
      label: '邮箱',
      search: true
    },
    {
      prop: 'nickname',
      label: '昵称',
      search: true
    },
    {
      prop: 'password',
      label: '手机号',
      search: true
    },
    {
      prop: 'birthday',
      label: '生日',
      search: true,
      type: ElementTypeEnum.Date
    },
    {
      prop: 'createTime',
      label: '创建时间',
      hideInPage: ['add', 'edit'],
      range: true,
      search: true,
      type: ElementTypeEnum.Datetime
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      hideInPage: ['add', 'edit'],
      range: true,
      search: true,
      type: ElementTypeEnum.Datetime
    },
    {
      prop: 'avatar',
      label: '头像',
      hideInPage: ['list'],
      type: ElementTypeEnum.Upload,
      uploadType: 'single-image'
    },
    {
      prop: 'photoList',
      label: '照片墙',
      hideInPage: ['list'],
      type: ElementTypeEnum.Upload,
      uploadType: 'picture-card'
    },
    {
      prop: 'fileList',
      label: '文件列表',
      hideInPage: ['list'],
      type: ElementTypeEnum.Upload,
      uploadType: 'file-list'
    }
  ] as Column[]
}
