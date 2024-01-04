import {
  FormTypeEnum,
  UploadTypeEnum,
  type FormColumn as Column
} from '@/chant'

export default () => {
  return [
    {
      prop: 'loginName',
      label: '用户名'
    },
    {
      prop: 'name',
      label: '姓名'
    },
    {
      prop: 'gender',
      label: '性别',
      type: FormTypeEnum.Select
    },
    {
      prop: 'status',
      label: '状态',
      type: FormTypeEnum.Select
    },
    {
      prop: 'email',
      label: '邮箱'
    },
    {
      prop: 'nickname',
      label: '昵称'
    },
    {
      prop: 'password',
      label: '手机号'
    },
    {
      prop: 'birthday',
      label: '生日',
      type: FormTypeEnum.Date
    },
    {
      prop: 'avatar',
      label: '头像',
      type: FormTypeEnum.Upload,
      uploadType: UploadTypeEnum.SingleImage
    },
    {
      prop: 'photoList',
      label: '照片墙',
      type: FormTypeEnum.Upload,
      uploadType: UploadTypeEnum.PictureCard
    },
    {
      prop: 'fileList',
      label: '文件列表',
      type: FormTypeEnum.Upload,
      uploadType: UploadTypeEnum.FileList
    }
  ] as Column[]
}
