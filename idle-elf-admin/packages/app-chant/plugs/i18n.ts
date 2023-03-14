import { createI18n } from 'vue-i18n'
import { LangEnum, StorageEnum } from '../enum'
import messages from '../lang'
import storage from '../share/storage'

const lang = storage.getLocal(StorageEnum.Lang) as LangEnum

export const vuei18n = createI18n({
  legacy: false,
  locale: lang || LangEnum.Zh,
  messages
})
