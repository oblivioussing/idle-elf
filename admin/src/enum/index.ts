export * from './api-code'

export enum Bus {
  ClosePage = 'close-page',
  CloseAllPage = 'close-all-page',
  HomeKeeps = 'home-keeps',
  NavMenu = 'nav-menu',
  Mount = 'mount'
}

export enum Format {
  Dict = 'dict',
  DictList = 'dict-list',
  Date = 'date',
  Datetime = 'datetime',
  Money = 'money'
}

export enum FormType {
  Border = 'border',
  Date = 'date',
  DateTime = 'datetime',
  Daterange = 'daterange',
  Datetimerange = 'datetimerange',
  Divider = 'divider',
  Input = 'input',
  InputNumber = 'inputnumber',
  Month = 'month',
  Monthrange = 'monthrange',
  Range = 'range',
  Radio = 'radio',
  Select = 'select',
  SelectMultiple = 'select-multiple',
  Textarea = 'textarea',
  TimePicker = 'timepicker',
  TimeSelect = 'timeselect'
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

export enum PagePathEnum {
  abc = 'abc'
}

export enum StorageEnum {
  Lang = 'language',
  HomeNavTab = 'hom-nav-tab',
  PageRelation = 'page-relation',
  RouterQuery = 'router-query',
  User = 'user'
}
