import { ElMessage } from 'element-plus'
import { InboundStatus, LangEnum } from '../enum'
import { jssip, vuei18n } from '../plugs'
import { ctilink, sound } from '.'
import { useCallStore } from '../store'

const en = {
  mustPhone: 'Number cannot be empty',
  moveInCall: 'Please check in before calling',
  currentCalling: 'Currently in a call'
}
const zh = {
  moveInCall: '请先签入,再拨打电话',
  mustPhone: '号码不能为空',
  currentCalling: '当前正处于通话中'
}
const localeMap = { en, zh }

export default {
  // 初始化
  init() {
    // jssip初始化
    jssip.init({
      // 注册成功
      registered() {
        // ctilink初始化
        ctilink.init()
      }
    })
  },
  // 拨打电话
  callOut(phone?: string, callSn?: string) {
    ctilink.callOut({
      callee: phone,
      extField: { callSn }
    })
  },
  // 能否拨打电话
  canCall() {
    const locale = vuei18n.global.locale.value as LangEnum
    const messages = localeMap[locale]
    const callStore = useCallStore()
    if (!callStore.online) {
      ElMessage.warning(messages.moveInCall)
      return false
    }
    if (callStore.calling) {
      ElMessage.warning(messages.currentCalling)
      return false
    }
    return true
  },
  // 接听电话
  answer() {
    jssip.answer()
  },
  // 切换呼入状态
  switchStatus(status: InboundStatus) {
    ctilink.switchStatus(status)
  },
  // 挂断
  hangUp() {
    ctilink.hangup()
    jssip.terminateSessions()
    sound.pause()
  },
  // 签出
  logout() {
    jssip.unregister()
    ctilink.logout()
  },
  // jssip注销
  jssipUnregister() {
    jssip.unregister()
  }
}
