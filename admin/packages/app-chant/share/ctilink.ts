import { ElMessage } from 'element-plus'
import { shiki, Api, Result } from '../api'
import {
  AgentStatus,
  ApiCode,
  Bus,
  DirectionType,
  FollowUpType,
  InboundType,
  InboundStatus
} from '../enum'
import { bus, core, workbench } from '.'
import { useCallStore } from '../store'

// 指令
enum Cmd {
  Login = 'LOGIN', // 签入
  Logout = 'LOGOUT', // 签出
  CallOut = 'CALLOUT', // 呼叫
  Hangup = 'HANGUP', // 挂机
  SwitchStatus = 'SWITCHSTATUS', // 状态切换
  Heart = 'HEART', // 心跳
  OnRing = 'ONRING', // 振铃事件
  OnAnswer = 'ONANSWER', // 应答事件
  OnHangup = 'ONHANGUP', // 挂机事件
  OnStatus = 'ONSTATUS', // 坐席状态变更
  FindCdrByEmu = 'FINDCDRBYEMU' // 查询话单
}
// 数据集
type Data = {
  cmd: Cmd // 指令
  sessionId: string // 唯一会话id
  agentStatus: string // 坐席状态
  directionType: DirectionType // 呼叫方向
  followUpType: FollowUpType // 跟进类型
  sameCallUuid: string // 查询话单的唯一标识
  eventTime: string // 事件产生的时间
  inboundType: string // 呼入业务类型
  mergeCdrCallUuid: string // 合并id
  answerTime: string // 接通时间
  hangupTime: string // 挂断时间
  createTime: string // 拨打时间
  bridgeSec: string // 接通时长
  hangupCause: string // 挂断原因
  telNumber: string // 电话号码
  calleeGatewayNumber: string // 被叫网关号码
  callerGatewayNumber: string // 主叫网关号码
}

class Ctilink {
  private ws?: WebSocket // websocket实例
  private isKeep = false // 是否处于连接状态
  private isReconnect = true // 是否需要重连
  private reconnectTimes = 0 // 重连次数
  private heartTimer: any // 心跳timer
  private reconnectTimer: any // 重连timer
  private exten?: string // 坐席
  private password?: string // 密码
  private sessionId?: string // 唯一会话id
  private callStore?: ReturnType<typeof useCallStore> // call store
  // 初始化
  init() {
    this.callStore = useCallStore()
    // 坐席信息
    const { ext, pwd } = this.callStore.agentInfo || {}
    this.exten = ext
    this.password = pwd
    // websocket初始化
    const url = core.getBaseUrl()
    this.ws = new WebSocket(`wss://${url}/cxscc/s/websocket`)
    // open
    this.ws.onopen = () => {
      // 连接状态激活
      this.isKeep = true
      // 签入
      this.login()
    }
    // message
    this.ws.onmessage = (ret) => {
      // 消息处理
      ret?.data && this.deal(JSON.parse(ret.data))
      // 心跳检测
      this.heartCheck()
    }
    // close
    this.ws.onclose = (ret) => {
      console.log('ctilink onclose:', ret)
      this.isKeep = false
      // 重连
      this.reconnect()
    }
    // error
    this.ws.onerror = (ret) => {
      console.log('ctilink error:', ret)
      this.isKeep = false
      // 重连
      this.reconnect()
    }
  }
  // 呼叫
  callOut(row: {
    callee?: string // 被叫号码
    gateway?: string // 线路号码
    extField?: object // 自定义扩展字段
  }) {
    const params = {
      cmd: Cmd.CallOut,
      caller: this.exten,
      callee: row.callee,
      extField: row.extField
    }
    this.send(params)
  }
  // 挂机
  hangup() {
    const params = {
      cmd: Cmd.Hangup,
      exten: this.exten
    }
    this.send(params)
  }
  // 状态切换
  switchStatus(inboundStatus: InboundStatus) {
    const params = {
      cmd: Cmd.SwitchStatus,
      exten: this.exten,
      inboundStatus
    }
    this.send(params)
  }
  // 签出
  logout() {
    const params = {
      cmd: Cmd.Logout,
      exten: this.exten,
      password: this.password
    }
    this.isKeep = false
    this.isReconnect = false
    if (this.callStore) {
      this.callStore.agentStatus = AgentStatus.NotLogin
    }
    clearTimeout(this.heartTimer)
    this.send(params)
    this.ws?.close()
  }
  // 消息处理
  private deal(result: Result) {
    const data = result.resultData as Data
    if (result.resultCode !== ApiCode.Success) {
      const msg = result.resultMsg
      console.log('ctilink resultMsg:', msg)
      // 非挂机事件提示错误
      if (data?.cmd !== Cmd.Hangup && msg) {
        ElMessage.error(msg)
      }
      // 拨打事件
      if (data?.cmd === Cmd.CallOut) {
        // 停止自动外呼
        if (this.callStore?.autoCall) {
          this.callStore.autoCall = false
        }
      }
      return
    }
    // 心跳
    if (data.cmd === Cmd.Heart) {
      return
    }
    // log
    console.log('deal:', data)
    // 坐席状态变更事件
    if (data.cmd === Cmd.OnStatus) {
      this.callStore!.agentStatus = data.agentStatus as AgentStatus
    }
    // 签入
    if (data.cmd === Cmd.Login) {
      this.sessionId = data.sessionId
      return
    }
    // 振铃事件
    if (data.cmd === Cmd.OnRing) {
      this.callStore!.directionType = data.directionType
      this.callStore!.agentStatus = AgentStatus.Ringing
      this.callStore!.followUpType = data.followUpType
      this.callStore!.inboundType = data.inboundType as InboundType
      this.callStore!.phone = data.telNumber
      this.callStore!.getwayNumber = {
        calleeGatewayNumber: data.calleeGatewayNumber,
        callerGatewayNumber: data.callerGatewayNumber
      }
      // ai转人工
      if (data.followUpType === FollowUpType.AiToManual) {
        this.callStore?.saveAiToManualParams(data)
      }
      // 呼出
      if (data.directionType === DirectionType.Out) {
        // 拨打时间
        this.callStore!.callResult.callingTime = Number(data.eventTime)
      }
      return
    }
    // 应答事件
    if (data.cmd === Cmd.OnAnswer) {
      // 接通时间
      this.callStore!.callResult.conTime = Number(data.eventTime)
      // 更新跟进记录
      workbench.updateFollowUp()
      // 发送应答通知
      bus.emit(Bus.Answer)
      return
    }
    // 挂机事件
    if (data.cmd === Cmd.OnHangup) {
      // 查询话单
      this.findCdrByExtenMergeUuid(data.mergeCdrCallUuid)
      // 发送挂机通知
      bus.emit(Bus.HangUp)
      return
    }
  }
  // 查询话单
  private async findCdrByExtenMergeUuid(id: string) {
    const path = Api.cc + 'cc/findCdrByExtenMergeUuid'
    const params = {
      cmd: Cmd.FindCdrByEmu,
      exten: this.exten,
      mergeCdrCallUuid: id
    }
    const { data } = await shiki.postData(path, params, { failTip: true })
    if (data) {
      const callResult = this.callStore!.callResult
      // 拨打时间
      callResult.callingTime = data.createTime || callResult.callingTime
      // 接通时间
      callResult.conTime = data.answerTime || callResult.conTime
      // 挂机时间
      callResult.hangupTime = data.hangupTime || callResult.hangupTime
      // 接通时长
      callResult.talkingTime = data.bridgeSec || callResult.talkingTime
      // 通话编码
      callResult.resultCode = data.hangupCode || callResult.resultCode
      // 通话结果
      callResult.resultMark = data.hangupCause || callResult.resultMark
      // 录音路径
      callResult.recordPath = data.recordPath
      // 录音文件名
      callResult.recordFile = data.recordFile
      // 更新跟进记录
      await workbench.updateFollowUp()
      // 发送挂机通知
      bus.emit(Bus.HangUp)
    }
  }
  // 签入
  private login() {
    const params = {
      cmd: Cmd.Login,
      exten: this.exten,
      password: this.password
    }
    this.send(params)
  }
  // 心跳检测
  private heartCheck() {
    const time = 30000
    this.heartTimer && clearTimeout(this.heartTimer)
    this.heartTimer = setTimeout(() => {
      this.send({ cmd: Cmd.Heart, code: '1' })
      // 如果10秒内服务器没有响应,说明连接已经断开,开始重连
      setTimeout(() => {
        !this.isKeep && this.reconnect()
      }, time + 10000)
    }, time)
  }
  // 重连
  private reconnect() {
    if (this.isReconnect && !this.isKeep) {
      if (this.reconnectTimes > 10) {
        this.isReconnect = false
        return
      }
      this.reconnectTimes++
      this.reconnectTimer && clearTimeout(this.reconnectTimer)
      this.reconnectTimer = setTimeout(() => {
        this.ws?.close()
        this.init()
      }, 10000)
    }
  }
  // 发送
  private send(row: { cmd: Cmd; [key: string]: any }) {
    if (row.cmd !== Cmd.Heart) {
      console.log('send:', row)
    }
    this.ws?.send(JSON.stringify(row))
  }
}

export default new Ctilink()
