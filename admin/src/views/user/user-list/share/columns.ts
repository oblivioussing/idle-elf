import { FormTypeEnum, type ListColumn as Column } from '@/chant'

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
      type: FormTypeEnum.Select
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
      type: FormTypeEnum.Select
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
      type: FormTypeEnum.Date
    },
    {
      prop: 'createTime',
      label: '创建时间',
      search: true,
      type: FormTypeEnum.DatetimeRange
    },
    {
      prop: 'updateTime',
      label: '更新时间',
      search: true,
      type: FormTypeEnum.DatetimeRange
    }
  ] as Column[]
}
