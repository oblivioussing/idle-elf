export enum ApiCode {
  Success = '10', // 成功
  NoLogin = '11', // 未登录
  Fail = '12', // 失败
  ParamError = '13', // 参数错误
  Exception = '14' // 系统异常
}

export enum BlobTypeEnum {
  Audio = 'audio/wav',
  Excel = 'application/vnd.ms-excel',
  Text = 'text/javascript',
  Wrod = 'application/msword',
  Json = 'application/json'
}

export enum BusEnum {
  ClosePage = 'close-page',
  CloseAllPage = 'close-all-page',
  HomeKeeps = 'home-keeps',
  NavMenu = 'nav-menu',
  Mount = 'mount'
}

export enum LangEnum {
  En = 'en',
  Zh = 'zh'
}

export enum StorageEnum {
  Lang = 'language',
  HomeNavTab = 'hom-nav-tab',
  PageRelation = 'page-relation',
  RouterQuery = 'router-query',
  User = 'user'
}
