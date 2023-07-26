import { core, sound } from '../share'
import { useCallStore } from '../store'

type Options = {
  registered: Function
}

class Jssip {
  // var
  private serverAddr = ''
  private serverPort = '7443'
  private protocol = 'wss'
  private ua: any
  private RTCSession: any
  private callStore?: ReturnType<typeof useCallStore>
  // 初始化
  init(options?: Options) {
    this.serverAddr = core.getFsUrl()
    this.callStore = useCallStore()
    // ua初始化
    this.uaInit()
    // 函数绑定回调事件
    if (this.ua) {
      // 连接
      this.ua.on('connected', () => {
        console.log('jssip connected')
      })
      // 注册成功
      this.ua.on('registered', () => {
        console.log('jssip registered')
        options?.registered()
      })
      // 注册失败
      this.ua.on('registrationFailed', (e: any) => {
        console.log('jssip registrationFailed:', e)
      })
      // 新的通话
      this.ua.on('newRTCSession', (e: any) => {
        this.newRTCSession(e)
      })
    }
  }
  // 接听电话
  answer() {
    try {
      this.RTCSession?.answer()
    } catch (error) {
      console.error(error)
    }
  }
  // ua初始化
  private uaInit() {
    const { ext, pwd } = this.callStore?.agentInfo || {}
    if (!ext) {
      return
    }
    // 确认jssip已经加载
    if (!(window as any).JsSIP) {
      setTimeout(() => {
        this.uaInit()
      }, 0)
      return
    }
    const socket = new (window as any).JsSIP.WebSocketInterface(
      `${this.protocol}://${this.serverAddr}:${this.serverPort}`
    )
    const configuration = {
      sockets: [socket],
      uri: `sip:${ext}@${this.serverAddr}`,
      password: pwd,
      register: true,
      session_timers: false
    }
    this.ua = new (window as any).JsSIP.UA(configuration)
    this.ua.start()
  }
  // 新的通话
  private newRTCSession(e: any) {
    const { session } = e
    session.on('confirmed', () => {
      console.log('jssip confirmed')
      const stream = new MediaStream()
      const receivers = session.connection?.getReceivers()
      if (receivers) {
        receivers.forEach((receiver: any) => stream.addTrack(receiver.track))
      }
      // 播放声音
      sound.setSrcObject(stream)
      sound.play()
    })
    this.RTCSession = session
    console.log('jssip newRTCSession:', session)
  }
  // 拨打电话回调
  private getCallOptions() {
    const eventHandlers = {
      progress: (e: any) => {
        console.log('call is in progress:' + e)
      },
      failed: (e: any) => {
        console.log('call failed with cause: ' + e.data.cause)
      },
      ended: (e: any) => {
        console.log('call ended with cause: ' + e.data.cause)
      },
      confirmed: (e: any) => {
        console.log('call confirmed:', e)
      }
    }
    const options = {
      eventHandlers,
      mediaConstraints: {
        audio: true,
        video: false
      },
      mediaStream: null
    }
    return options
  }
  // 拨打电话
  call(phone: string) {
    // 拨打电话回调
    const options = this.getCallOptions()
    this.ua?.call(`sip:${phone}@${this.serverAddr}`, options)
  }
  // 挂断电话
  terminateSessions() {
    this.ua?.terminateSessions()
  }
  // start
  start() {
    this.ua?.start()
  }
  // stop
  stop() {
    this.ua?.stop()
  }
  // unregister
  unregister() {
    this.ua?.unregister({ all: true })
  }
}

export default new Jssip()
