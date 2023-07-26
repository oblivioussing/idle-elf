export enum ApiCode {
  Success = '10', // 成功
  AuthFail = '11', // 权限认证失败
  NoLogin = '12', // 未登录
  LonginExpire = '13', // 登录超时，请重新登录
  Locked = '14', // 失败登录次数过多，用户被锁定
  ServerFail = '15', // 登录名不能为空
  TokenKey = '16', // 令牌密钥不能为空
  AuthEmpty = '17', // 权限认证失败
  SysEmpty = '19', // 登录系统不能为空
  SysIncorrect = '20', // 登录系统不正确
  NoPlatform = '37', // 非平台用户，不能登录平台管理系统
  ForceLogin = '38', // 强制登陆
  Relogin = '39', // 当前账号已经在其他终端登录，请重新登录
  PermissionVerificationFailed = '40', // 权限校验失败，请联系管理员
  TokenStatus = '42', // 登录状态异常，请重新登录
  PleaseUpdatePwd = '43', // 请修改密码
  Unauthorized = '44', // 未授权，请联系管理员进行授权
  AuthorizationExpired = '45', // 授权过期
  NotWorkingProperly = '46', // 服务器授权信息被篡改，无法正常使用，请联系管理员
  LoginError = '48', // 登陆异常
  LoginValiCodeError = '11131923' // 登陆验证码错误
}
