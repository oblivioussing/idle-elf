<template>
  <div v-if="callStore.agentInfo?.ext" class="call-toolbar">
    <!-- 工号 -->
    <div class="item">{{ t('jobNo') }}: {{ userInfoCode || '-' }}</div>
    <!-- 坐席 -->
    <div class="item">
      {{ t('extension') }}: {{ callStore.agentInfo?.ext || '-' }}
    </div>
    <!-- 坐席状态 -->
    <div class="item">{{ t('agentStatus') }}: {{ agentActiveCpd }}</div>
    <!-- 开关 -->
    <div class="item">
      <el-switch
        v-model="state.switchActive"
        inline-prompt
        :loading="state.switchLoading"
        :before-change="(onSwitch as any)">
      </el-switch>
    </div>
    <!-- 员工状态 -->
    <div class="item">
      <chant-select
        v-model="state.inboundStatus"
        :data="state.dict.SipUserStatusEnum"
        :placeholder="t('userStatus')"
        style="width: 120px"
        @change="onInboundStatus">
      </chant-select>
    </div>
    <!-- 输入号码 -->
    <div class="item">
      <el-input
        v-model="state.phone"
        clearable
        :placeholder="tg('tips.enter') + t('number')"
        class="number-input">
      </el-input>
    </div>
    <!-- 坐席状态 -->
    <div class="item">{{ agentStatusCpd }}</div>
    <div class="item flex-align-center">
      <!-- 挂断 -->
      <chant-call
        bg="white"
        :content="t('hangup')"
        type="hangup"
        @click="onHangup">
      </chant-call>
      <!-- 接听 -->
      <chant-call
        v-if="ringTypeCpd === 'incoming'"
        bg="primary"
        :content="t('answer')"
        type="answer"
        class="m-l-5"
        @click="onAnswer">
      </chant-call>
    </div>
    <!-- 暂停自动外呼 -->
    <div class="item">
      <chant-icon-button
        v-if="callStore.autoCall"
        :content="t('stopAutoCall')"
        iconfont="icon-stop"
        placement="bottom"
        size="normal"
        type="danger"
        @click="onStopAutoCall">
      </chant-icon-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onScopeDispose, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { shiki, Api } from '@chant/api'
import {
  AgentStatus,
  Bus,
  DirectionType,
  FollowUpDataType,
  InboundStatus,
  PagePathEnum,
  QueueType
} from '@chant/enum'
import { element } from '@chant/plugs'
import { base, bus, call, sound, workbench } from '@chant/share'
import { useCallStore, useUserStore } from '@chant/store'
import { useChaoser } from '@chant/use'
import lang from './share/lang'

// use
const chaoser = useChaoser()
// store
const callStore = useCallStore()
const userStore = useUserStore()
// i18n
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
// var
const userInfoCode = userStore.operator?.userInfoBase?.userInfoCode
let autoLoop: any
// state
const state = reactive({
  switchActive: false, // 开关
  inboundStatus: '' as InboundStatus, // 呼入状态
  dict: {} as any, // 字典
  phone: '', // 电话
  contactPhoneList: [], // 联系人号码列表
  switchLoading: false // 开关 loading
})
// onMounted
onMounted(() => {
  // 获取坐席信息
  getAgentInfo()
})
// 振玲类型
const ringTypeCpd = computed(() => {
  const status = callStore.agentStatus
  const directionType = callStore.directionType
  if (status === AgentStatus.Ringing) {
    // 拨打中
    if (directionType === DirectionType.Out) {
      return 'out'
    }
    // 来电振铃中
    if (directionType === DirectionType.Incoming) {
      return 'incoming'
    }
  }
})
// 坐席状态
const agentStatusCpd = computed(() => {
  const status = callStore.agentStatus
  // 空闲中
  if (status === AgentStatus.Idle) {
    return t('idle')
  }
  // 拨打中
  if (ringTypeCpd.value === 'out') {
    call.switchStatus(state.inboundStatus)
    return t('dialing')
  }
  // 来电振铃中
  if (ringTypeCpd.value === 'incoming') {
    call.switchStatus(state.inboundStatus)
    return t('incomingCall')
  }
  // 通话中
  if (status === AgentStatus.Conversation) {
    state.inboundStatus = InboundStatus.Conversation
    call.switchStatus(state.inboundStatus)
    return t('calling')
  }
  // 坐席离线
  if (status === AgentStatus.NotLogin) {
    return t('offline')
  }
})
// 坐席开关状态
const agentActiveCpd = computed(() => {
  if (callStore.online) {
    state.switchActive = true
    return t('moveIn')
  } else {
    state.switchActive = false
    return t('moveOut')
  }
})
// 工作台参数
const workbenchQueryCpd = computed(() => {
  if (callStore.queueType === QueueType.Tel) {
    return callStore.workbench.collection
  } else {
    return callStore.workbench.customer
  }
})
// 是否最后一条案件
const lastCpd = computed(() => {
  const { serialNo, total } = workbenchQueryCpd.value
  const last = serialNo?.toString() === total?.toString()
  return last
})
// watch
watch(
  () => callStore.agentStatus, // call status
  () => {
    // 振铃
    if (callStore.agentStatus === AgentStatus.Ringing) {
      const directionType = callStore.directionType
      // 呼出
      if (directionType === DirectionType.Out) {
        // 自动接听
        call.answer()
        return
      }
      // 播放振铃音
      sound.ringingPlay()
    }
    // ctilink离线注销jssip
    if (callStore.agentStatus === AgentStatus.NotLogin) {
      call.jssipUnregister()
    }
  }
)
watch(
  () => callStore.phone,
  () => {
    state.phone = callStore.phone
  }
)
watch(
  () => state.phone,
  () => {
    callStore.phone = state.phone
  }
)
watch(
  () => workbenchQueryCpd,
  () => {
    // 清空联系人列表
    state.contactPhoneList = []
  },
  { deep: true }
)
watch(
  () => callStore.inboundStatus,
  () => {
    state.inboundStatus = callStore.inboundStatus
  }
)
// 应答事件
bus.on(Bus.Answer, () => {
  if (callStore.autoCall) {
    // 暂停自动外呼
    callStore.autoCall = false
    // 跳转到工作台
    jumpWorkbench()
  }
})
// 挂机事件
bus.on(Bus.HangUp, () => {
  state.inboundStatus = InboundStatus.Transaction
  call.switchStatus(state.inboundStatus)
  if (callStore.autoCall) {
    // 自动外呼(节流)
    if (autoLoop) {
      clearTimeout(autoLoop)
    }
    autoLoop = setTimeout(autoCall, 1500)
  }
})
// 继续外呼事件
bus.on(Bus.AutoCallContinue, () => {
  autoCall()
})
// onScopeDispose
onScopeDispose(() => {
  // 关闭事件监听
  bus.off(Bus.Answer)
  bus.off(Bus.HangUp)
})
// 获取坐席信息
async function getAgentInfo() {
  const path = Api.cc + 'cc/getSipUserByUser'
  const { data, dict } = await shiki.getData(path)
  if (data) {
    state.dict = dict
    callStore.agentInfo = data
    // 登陆坐席
    loginAgent()
  }
}
// 登陆坐席
async function loginAgent() {
  const path = Api.cc + 'cc/application'
  const params = { exten: callStore.agentInfo?.ext, cmd: 'AGENTSTATUS' }
  const { resultCode: code, resultData: data } = await shiki.post(path, {
    body: params,
    failTip: true
  })
  if (!shiki.isSuccess(code)) {
    return
  }
  // 呼入状态
  state.inboundStatus = data?.inboundStatus
  // 坐席状态
  const agentStatus = data?.agentStatus
  // 未登录
  if (agentStatus === AgentStatus.NotLogin) {
    call.init()
  } else {
    const confirm = t('continueMoveIn')
    const cancel = t('cancelMoveIn')
    // 重新签入确认
    const status = await element.confirm(t('reCheckIn'), { confirm, cancel })
    if (status) {
      call.init()
    }
  }
}
// 自动外呼
async function autoCall() {
  if (state.contactPhoneList.length) {
    // 拨打联系人号码
    callContactPhone()
  } else {
    // 获取联系人号码
    getContactPhoneList()
  }
}
// 拨打下一条案件
async function callNextCase() {
  const data = await workbench.turnPageQueue('next', callStore.queueType)
  if (data) {
    // 保存跟进并拨打电话
    workbench.autoCallFollow(data.id)
  } else {
    ElMessage.error(t('nextFail'))
  }
}
// 拨打联系人号码
function callContactPhone() {
  const sourceId = workbenchQueryCpd.value.id
  const phoneSourceId = state.contactPhoneList.shift()
  // 保存跟进并拨打电话
  workbench.autoCallFollow(sourceId, { contactPhone: true, phoneSourceId })
}
// 获取联系人号码
async function getContactPhoneList() {
  const path = Api.crmmu + 'wod/getQueueUnitContactPhoneIdList'
  const { queueId, id } = workbenchQueryCpd.value
  const params = { queueId, unitId: id }
  const { data } = await shiki.getData(path, params)
  if (data?.length) {
    state.contactPhoneList = data
    // 拨打联系人号码
    callContactPhone()
  } else {
    if (lastCpd.value) {
      // 结束自动外呼
      callStore.autoCall = false
      ElMessage.warning(t('queueEnd'))
    } else {
      // 拨打下一条案件
      callNextCase()
    }
  }
}
// 挂断
function onHangup() {
  // 处于自动外呼中,则暂停自动外呼
  if (callStore.autoCall) {
    callStore.autoCall = false
  }
  call.hangUp()
}
// 暂停自动外呼
function onStopAutoCall() {
  workbench.stopAutoCall()
}
// 拨打
function onCall() {
  // 直接拨打电话
  directCallOut()
}
// 接听
function onAnswer() {
  // 暂停振玲
  sound.pause()
  // 接听电话
  call.answer()
  // 页面路径
  let path = '' as PagePathEnum
  // 业务类型
  const inboundType = callStore.inboundType
  // 催收
  if (workbench.isCollection(inboundType)) {
    path = PagePathEnum.CaseCollectionWorkbench
  }
  // 客服
  if (workbench.isCustomerService(inboundType)) {
    path = PagePathEnum.CustomerServiceWorkbench
  }
  base.closePage(path)
  setTimeout(() => {
    chaoser.push({ path, query: { isEdit: '1' } })
  }, 500)
}
// 直接拨打电话
async function directCallOut() {
  const path = Api.crmmu + 'wod/saveDirectFollowUp'
  const phone = state.phone
  const data = await shiki.postData(path, { phone }, { failTip: true })
  if (data) {
    call.callOut(state.phone, data)
  }
}
// 开关变更
async function onSwitch() {
  state.switchLoading = true
  if (state.switchActive) {
    // 签出
    await onLogout()
  } else {
    // 登陆坐席
    await loginAgent()
  }
  state.switchLoading = false
}
// 呼入状态
function onInboundStatus(val: InboundStatus) {
  call.switchStatus(val)
}
// 签出
async function onLogout() {
  const status = await element.confirm(t('confirmDisconnect'))
  if (status) {
    call.logout()
  }
  return status
}
// 跳转到工作台
function jumpWorkbench() {
  let path
  let query
  if (callStore.business.followUpDataType === FollowUpDataType.Customer) {
    path = PagePathEnum.CustomerWorkbench
    query = callStore.workbench.customer
  } else {
    path = PagePathEnum.CaseWorkbench
    query = callStore.workbench.collection
  }
  chaoser.push({ path, query })
}
</script>

<style scoped lang="scss">
@import '@chant/style/var.scss';
.call-toolbar {
  display: flex;
  align-items: center;
  font-size: 12px;
  .item {
    margin: 0 5px;
    .number-input {
      width: 120px;
    }
  }
}
</style>
