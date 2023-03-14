export * from './api-code'
export * from './business'
export * from './call'
export * from './page-path'

export enum FormType {
  TimePicker = 'timepicker',
  TimeSelect = 'timeselect',
  Date = 'date',
  DateTime = 'datetime',
  Daterange = 'daterange',
  Datetimerange = 'datetimerange',
  DepartmentPicker = 'department-picker',
  Divider = 'divider',
  Input = 'input',
  InputNumber = 'inputnumber',
  Month = 'month',
  Monthrange = 'monthrange',
  ProductPicker = 'product-picker',
  Range = 'range',
  Radio = 'radio',
  Select = 'select',
  SelectMultiple = 'select-multiple',
  SysTenant = 'sys-tenant',
  Textarea = 'textarea',
  TenantPicker = 'tenant-picker',
  UserPicker = 'user-picker',
  SpeechPicker = 'speech-picker'
}

export enum Format {
  Dict = 'dict',
  DictList = 'dict-list',
  Date = 'date',
  Datetime = 'datetime',
  Money = 'money'
}

export enum Bus {
  AutoCallContinue = 'auto-call-continue',
  Answer = 'answer',
  ClosePage = 'close-page',
  CloseAllPage = 'close-all-page',
  HangUp = 'hang-up',
  HomeKeeps = 'home-keeps',
  NavMenu = 'nav-menu',
  Mount = 'mount'
}

export enum StorageEnum {
  Dict = 'dict',
  DefaultValue = 'default-Value',
  Lang = 'language',
  HomeNavTab = 'hom-nav-tab',
  PageRelation = 'page-relation',
  RouterQuery = 'router-query',
  User = 'user'
}

export enum LangEnum {
  En = 'en',
  Zh = 'zh'
}

export enum PageEnum {
  Add = 'add',
  Edit = 'edit',
  Detail = 'detail'
}

export enum IndexCode {
  IntellectCall = '11', // 智能外呼
  ManualCall = '12', // 人工外呼
  AutoAddWx = '13', // 自动加微
  Marketing = '14' // 营销CRM
}

export enum BooleanEnum {
  NO = '0',
  YES = '1'
}
