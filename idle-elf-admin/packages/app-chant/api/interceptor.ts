import { ApiCode } from '../enum'
import router from '../router'
import shiki, { Result } from './shiki'

export default () => {
  // 请求拦截器
  shiki.interceptors.request.use((config: RequestInit) => {
    return config
  })
  // 响应拦截器
  shiki.interceptors.response.use(async (response: Result) => {
    // 重新登陆
    const arr = [
      ApiCode.AuthFail, // 权限认证失败
      ApiCode.NoLogin, // 未登录
      ApiCode.LonginExpire, // 登录超时，请重新登录
      ApiCode.Locked, // 失败登录次数过多，用户被锁定
      ApiCode.ServerFail, // 登录名不能为空
      ApiCode.TokenKey, // 令牌密钥不能为空
      ApiCode.AuthEmpty, // 权限认证失败
      ApiCode.SysEmpty, // 登录系统不能为空
      ApiCode.SysIncorrect, // 登录系统不正确
      ApiCode.NoPlatform, // 非平台用户，不能登录平台管理系统
      ApiCode.Relogin, // 当前账号已经在其他终端登录，请重新登录
      ApiCode.PermissionVerificationFailed, // 权限校验失败，请联系管理员
      ApiCode.TokenStatus, // 登录状态异常，请重新登录
      ApiCode.PleaseUpdatePwd, // 请修改密码
      ApiCode.LoginError // 登陆异常
    ]
    if (arr.includes(response?.resultCode)) {
      setTimeout(() => {
        router?.push('/login')
      }, 0)
    }
    // 授权
    const arrs = [
      ApiCode.Unauthorized, // 未授权，请联系管理员进行授权
      ApiCode.AuthorizationExpired, // 授权过期
      ApiCode.NotWorkingProperly // 服务器授权信息被篡改，无法正常使用，请联系管理员
    ]
    if (arrs.includes(response?.resultCode)) {
      setTimeout(() => {
        router?.push('/auth')
      }, 0)
    }
    return response
  })
}
