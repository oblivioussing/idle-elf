export enum ApiCode {
  Success = '1', // 成功
  Fail = '2', // 失败
  AuthFailed = '3', // 权限校验失败
  ParamError = '4', // 参数错误
  Exception = '5' // 系统异常
}

export enum ContentTypeEnum {
  Audio = 'audio/wav',
  Excel = 'application/vnd.ms-excel',
  Text = 'text/javascript',
  Wrod = 'application/msword',
  Json = 'application/json'
}

export enum BusEnum {
  ClosePage = 'close-page'
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
  TableFilter = 'table-filter',
  Token = 'token',
  User = 'user'
}
