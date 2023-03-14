import { defineStore } from 'pinia'
import {
  AgentStatus,
  DirectionType,
  FollowUpType,
  FollowUpDataType,
  InboundStatus,
  InboundType,
  QueueType
} from '../enum'

type Workbench = {
  queueId: string // 队列id
  serialNo: string // 序号
  id: string // id
  total: string // 总页码
  isEdit: string // 是否可编辑
}

export const useCallStore = defineStore('call', {
  state: () => ({
    agentInfo: {
      ext: '',
      pwd: ''
    }, // 坐席信息
    phone: '', // 当前呼叫的号码
    agentStatus: '' as AgentStatus, // 作息状态
    directionType: '' as DirectionType, // 呼叫方向
    followUpType: '' as FollowUpType, // 跟进类型
    inboundType: '' as InboundType, // 业务类型
    inboundStatus: '' as InboundStatus, // 呼入状态
    getwayNumber: {
      calleeGatewayNumber: '', // 被叫网关号码
      callerGatewayNumber: '' // 主叫网关号码
    }, // 网关号码
    autoCall: false, // 是否自动外呼中
    callResult: {
      callingTime: 0, // 拨打时间
      conTime: 0, // 接通时间
      hangupTime: 0, // 挂机时间
      talkingTime: '', // 接通时长
      resultCode: '', // 通话编码
      resultMark: '', // 通话结果
      recordPath: '', // 录音路径
      recordFile: '' // 录音文件名
    }, // 通话结果
    business: {
      id: '', // 跟进记录id
      phone: '', // 号码
      followUpDataType: '' as FollowUpDataType, // 跟进数据类型
      beFollowUpType: '', // 被跟进人类型
      contactName: '' // 被跟进人姓名
    }, // 呼叫的业务数据
    queueType: '' as QueueType, // 队列类型
    workbench: {
      collection: {} as Workbench, // 电催
      collectionComing: {}, // 催收呼入
      customer: {} as Workbench, // 客户
      customerService: {} as Workbench // 客服
    }, // 工作台参数
    aiToManualParams: {
      taskDataSn: '', // 智能外呼流水id
      owosn: '', // 客户工单编号
      ocsrsn: '', // 客户编号
      date: '', // 日期
      toSeatTypeCode: '' // AI转人工类型code
    } // ai转人工参数
  }),
  getters: {
    // 通话中
    calling: (state) => {
      // 通话,振铃
      const list = [AgentStatus.Conversation, AgentStatus.Ringing]
      return list.includes(state.agentStatus as AgentStatus)
    },
    // 是否登陆
    online(state) {
      const agentStatus = state.agentStatus
      return agentStatus && agentStatus !== AgentStatus.NotLogin
    }
  },
  actions: {
    // 清空通话结果
    clearCallResult() {
      this.callResult = {
        callingTime: 0, // 拨打时间
        conTime: 0, // 接通时间
        hangupTime: 0, // 挂机时间
        talkingTime: '', // 接通时长
        resultCode: '', // 通话编码
        resultMark: '', // 通话结果
        recordPath: '', // 录音路径
        recordFile: '' // 录音文件名
      }
    },
    // 保存ai转人工参数
    saveAiToManualParams(row: any) {
      const params = this.aiToManualParams as Record<string, any>
      for (let item in params) {
        if (row && row[item]) {
          params[item] = row[item]
        }
      }
    }
  }
})
