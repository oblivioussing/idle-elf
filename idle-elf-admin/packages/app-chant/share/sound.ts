import ringing from '../assests/mp3/ringing.mp3'

class Sound {
  audio: HTMLAudioElement | undefined

  private id
  private container?: HTMLElement
  constructor(config?: { container: HTMLElement }) {
    this.container = config?.container
    const random = Math.random().toString().replaceAll('.', '-')
    this.id = 'CHANT-GLOGAL-AUDIO' + random
    // 创建audio
    this.createAudio()
  }
  // 播放
  play() {
    if (this.audio) {
      this.audio.removeAttribute('loop')
      this.audio?.play()
    }
  }
  // 循环播放
  loopPlay() {
    if (this.audio) {
      this.audio.setAttribute('loop', 'loop')
      this.audio.play()
    }
  }
  // 播放振铃
  ringingPlay() {
    this.setSrc(ringing)
    this.loopPlay()
  }
  // 暂停
  pause() {
    this.audio?.pause()
  }
  // 设置声音地址
  setSrc(url: string) {
    if (this.audio) {
      this.audio.srcObject = null
      this.audio.src = url
    }
  }
  // 设置声音源
  setSrcObject(stream: MediaStream) {
    if (this.audio) {
      this.audio.src = ''
      this.audio.srcObject = stream
    }
  }
  // 创建audio
  private createAudio() {
    let audio = document.querySelector(`#${this.id}`) as HTMLAudioElement
    if (!audio) {
      audio = document.createElement('audio')
      audio.setAttribute('id', this.id)
      if (this.container) {
        this.container.appendChild(audio)
      } else {
        document.body.appendChild(audio)
      }
    }
    this.audio = audio
  }
}

export { Sound }

export default new Sound()
