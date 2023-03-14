import { shiki, Api } from '../api'
import call from './call'
import {
  FollowUpType,
  FollowUpDataType,
  InboundType,
  PhoneSourceType,
  QueueType
} from '../enum'
import { useCallStore } from '../store'

export default {
  // 保存跟进并外呼
  async followAndCall(config: {
    sourceId: string // 来源id
    followUpDataType: FollowUpDataType // 跟进数据类型
    phoneSourceType: PhoneSourceType // 号码来源类型
    phoneSourceId: string // 号码来源id
    phoneSourceField: string // 号码来源字段
  }) {
    // 能否拨打电话
    const status = call.canCall()
    if (!status) {
      return
    }
    const params = Object.assign(config, {
      followUpType: FollowUpType.HumanOutbound // 跟进类型(人工外呼)
    })
    const data = await this.saveFolloUp(params)
    if (data) {
      const callStore = useCallStore()
      // 业务数据
      const { callSn, phone } = data
      callStore.phone = phone
      callStore.business = {
        id: callSn,
        phone,
        beFollowUpType: data.beFollowUpType,
        contactName: data.contactName,
        followUpDataType: config.followUpDataType
      }
      // 清空通话结果
      callStore.clearCallResult()
      // 拨打
      call.callOut(phone, callSn)
      return true
    }
  },
  // 保存跟进记录
  async saveFolloUp(config: {
    sourceId: string // 来源id
    phoneSourceType: PhoneSourceType // 号码来源类型
    phoneSourceId: string // 号码来源id
    phoneSourceField: string // 号码来源字段
    followUpType: FollowUpType // 跟进类型
    followUpDataType: FollowUpDataType // 跟进数据类型
  }) {
    const params = {
      sourceId: config.sourceId,
      phoneSourceType: config.phoneSourceType,
      phoneSourceId: config.phoneSourceId,
      phoneSourceField: config.phoneSourceField,
      followUpType: config.followUpType,
      followUpDataType: config.followUpDataType
    }
    const path = Api.crmmu + 'wod/saveManualFollowUp'
    const { data } = await shiki.postData(path, params, { failTip: true })
    return data
  },
  // 更新跟进记录
  async updateFollowUp() {
    const callStore = useCallStore()
    const params = Object.assign(
      callStore.business,
      callStore.callResult,
      callStore.getwayNumber
    )
    const path = Api.crmmu + 'wod/updateManualFollowUp'
    return await shiki.postCode(path, params, { tip: false })
  },
  // 自动外呼的保存跟进
  async autoCallFollow(
    sourceId: string,
    config?: {
      contactPhone?: boolean // 是否为联系人电话
      phoneSourceId?: string // 号码来源id
    }
  ) {
    const callStore = useCallStore()
    const queueType = callStore.queueType
    // 参数
    let followUpDataType: FollowUpDataType
    let phoneSourceType: PhoneSourceType
    // 电催
    if (queueType === QueueType.Tel) {
      if (config?.contactPhone) {
        followUpDataType = FollowUpDataType.CaseContactPhone
        phoneSourceType = PhoneSourceType.ContactPhone
      } else {
        followUpDataType = FollowUpDataType.Case
        phoneSourceType = PhoneSourceType.Case
      }
    }
    // 客户
    if (queueType === QueueType.Customer) {
      if (config?.contactPhone) {
        followUpDataType = FollowUpDataType.CustomerContactPhone
        phoneSourceType = PhoneSourceType.ContactPhone
      } else {
        followUpDataType = FollowUpDataType.Customer
        phoneSourceType = PhoneSourceType.Customer
      }
    }
    // 保存跟进并拨打电话
    const status = await this.followAndCall({
      sourceId,
      followUpDataType: followUpDataType!,
      phoneSourceType: phoneSourceType!,
      phoneSourceId: config?.phoneSourceId || sourceId,
      phoneSourceField: 'phone'
    })
    if (status) {
      const callStore = useCallStore()
      callStore.autoCall = true
    }
  },
  // 切换队列数据
  async turnPageQueue(type: 'prev' | 'next', queueType: QueueType) {
    const callStore = useCallStore()
    let workbench
    if (queueType === QueueType.Tel) {
      workbench = callStore.workbench.collection
    } else {
      workbench = callStore.workbench.customer
    }
    const params = {
      queueId: workbench.queueId, // 队列id
      serialNo: workbench.serialNo, // 序号
      pageTurningMode: type // 类型 prev上一条 next下一条
    }
    const path = Api.crmmu + 'wod/turnPageJobQueue'
    const { data } = await shiki.getData(path, params)
    if (data) {
      const query = {
        queueId: workbench.queueId, // 队列id
        serialNo: data.index, // 序号
        id: data.id, // id
        total: workbench.total, // 总页码
        isEdit: '1' // 可编辑
      }
      if (queueType === QueueType.Tel) {
        callStore.workbench.collection = query
      } else {
        callStore.workbench.customer = query
      }
      return query
    }
  },
  // 暂停自动外呼
  stopAutoCall() {
    const callStore = useCallStore()
    callStore.autoCall = false
    call.hangUp()
  },
  // 催收场景
  isCollection(type: InboundType) {
    return [InboundType.Collection].includes(type)
  },
  // 客服场景
  isCustomerService(type: InboundType) {
    return [
      InboundType.Visit, // 回访
      InboundType.Market, // 营销
      InboundType.Notice, // 通知
      InboundType.Debt, // 债务
      InboundType.Complaint, // 投诉
      InboundType.Seek // 咨询
    ].includes(type)
  }
}
