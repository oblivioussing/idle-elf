import { ElMessage } from 'element-plus'
import { LangEnum } from '@chant/enum'
import { vuei18n } from '@chant/plugs'

export { default as dict } from './dict'
export { default as lang } from './lang'

const messages = {
  en: {
    limitHint: 'file size cannot exceed'
  },
  zh: {
    limitHint: '文件大小不能超过'
  }
}

// 文件校验
export function fileVali(rawFile: any, limitSize?: number) {
  const locale = vuei18n.global.locale
  if (!limitSize) {
    return true
  }
  const { limitHint } = messages[locale.value as LangEnum]
  const size = rawFile.size / 1024 / 1024
  if (size > limitSize) {
    const msg = limitHint + limitSize + 'M'
    ElMessage.error(msg)
    return false
  }
  return true
}
