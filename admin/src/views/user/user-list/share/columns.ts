import type { Column } from '@/chant'

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
      type: 'select'
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
      type: 'select'
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
      type: 'date'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      hideInPage: ['add', 'edit'],
      search: true,
      type: 'date-picker',
      datepickerType: 'datetime'
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      hideInPage: ['add', 'edit'],
      search: true,
      type: 'date-picker',
      datepickerType: 'datetime'
    },
    {
      prop: 'avatar',
      label: '头像',
      hideInPage: ['list'],
      type: 'upload',
      uploadType: 'single-image'
    },
    {
      prop: 'photoList',
      label: '照片墙',
      hideInPage: ['list'],
      type: 'upload',
      uploadType: 'picture-card'
    },
    {
      prop: 'fileList',
      label: '文件列表',
      hideInPage: ['list'],
      type: 'upload',
      uploadType: 'file-list'
    }
  ] as Column[]
}
