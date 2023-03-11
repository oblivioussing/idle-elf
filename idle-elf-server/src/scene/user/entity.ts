import { User } from 'prisma/prisma-client'

export const UserEntity: User = {
  id: '', // id
  avator: '', // 头像
  birthday: null, // 出生日期
  createTime: null, // 创建时间
  email: '', // 邮箱
  gender: '', // 性别(0-女 1-男)
  loginName: '', // 用户名
  name: '', // 姓名
  nickname: '', // 昵称
  password: '', // 密码
  phone: '', // 手机号
  updateTime: null // 更新时间
}
