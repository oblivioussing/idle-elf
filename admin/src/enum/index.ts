export enum ApiCode {
  Success = '1', // 成功
  NoLogin = '2', // 未登录
  Fail = '3', // 失败
  ParamError = '4', // 参数错误
  Exception = '5' // 系统异常
}

export enum BlobTypeEnum {
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
  User = 'user'
}
