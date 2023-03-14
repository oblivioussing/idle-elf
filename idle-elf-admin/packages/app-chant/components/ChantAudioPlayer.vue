<template>
  <div v-if="props.url" ref="containerRef" @click.stop>
    <!-- 普通 -->
    <template v-if="props.mode === 'normal'">
      <div class="audio-box">
        <!-- 播放/暂停 -->
        <chant-icon-button
          circle
          :iconfont="state.isPlaying ? 'icon-stop' : 'icon-play1'"
          tip-disabled
          @click="onPlay">
        </chant-icon-button>
        <!-- 进度条 -->
        <div class="slider-box">
          <el-slider
            v-model="state.sliderValue"
            :show-tooltip="false"
            @change="onChange">
          </el-slider>
        </div>
        <!-- 倍速 -->
        <el-dropdown @command="onRate" class="dropdown-box">
          <span>x{{ state.speed }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="0.8">0.8</el-dropdown-item>
              <el-dropdown-item command="1.0">1.0</el-dropdown-item>
              <el-dropdown-item command="2.0">2.0</el-dropdown-item>
              <el-dropdown-item command="3.0">3.0</el-dropdown-item>
              <el-dropdown-item command="4.0">4.0</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- 下载 -->
        <chant-icon-button
          circle
          icon-type="download"
          tip-disabled
          @click="onDownload">
        </chant-icon-button>
      </div>
      <div class="time-box">
        <div>{{ timeFmt(state.current) }}</div>
        <div>{{ timeFmt(state.total) }}</div>
      </div>
    </template>
    <!-- 简单 -->
    <template v-if="props.mode === 'simple'">
      <div class="audio-box">
        <!-- 播放/暂停 -->
        <chant-icon-button
          circle
          :iconfont="state.isPlaying ? 'icon-stop' : 'icon-play1'"
          tip-disabled
          @click="onPlay">
        </chant-icon-button>
        <!-- 下载 -->
        <chant-icon-button
          circle
          icon-type="download"
          tip-disabled
          @click="onDownload">
        </chant-icon-button>
      </div>
    </template>
  </div>
  <div v-else class="p-t-5">
    <el-divider>{{ t('notData') }}</el-divider>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { base, Sound } from '../share'
import ChantIconButton from './ChantIconButton.vue'

let sound: Sound | undefined

interface Props {
  url?: string // 音频地址
  mode?: 'normal' | 'simple' // 普通|简单
}
// props
const props = withDefaults(defineProps<Props>(), {
  mode: 'normal',
  showEmpty: true
})
// i18n
const { t } = useI18n({
  messages: {
    en: { notData: 'no record' },
    zh: { notData: '暂无录音记录' }
  }
})
// ref
const containerRef = ref()
// state
const state = reactive({
  speed: '1.0', // 倍速
  sliderValue: 0, // 滑块值
  current: 0, // 当前时间
  total: 0, // 总时间
  isPlaying: false // 是否处于播放中
})
// onMounted
onMounted(() => {
  // 初始化
  init()
})
// watch
watch(
  () => state.sliderValue,
  () => {
    if (state.sliderValue === 100) {
      state.isPlaying = false
    }
  }
)
watch(
  () => props.url,
  () => {
    // 设置音频地址
    if (props.url) {
      sound?.setSrc(props.url)
    }
  }
)
// 初始化
function init() {
  sound = new Sound({
    container: containerRef.value
  })
  // 设置音频地址
  if (props.url) {
    sound?.setSrc(props.url)
  }
  // 音频加载完成事件
  sound?.audio?.addEventListener('loadedmetadata', (ret) => {
    state.total = (ret?.target as any).duration
  })
  // 音频播放位置变化
  sound?.audio?.addEventListener('timeupdate', (ret) => {
    state.current = (ret.target as any).currentTime
    state.sliderValue = (state.current / state.total) * 100
  })
}
// 播放
function onPlay() {
  if (state.isPlaying) {
    sound?.pause()
  } else {
    sound?.play()
  }
  state.isPlaying = !state.isPlaying
}
// 倍速
function onRate(val: string) {
  state.speed = val
  if (sound?.audio) {
    sound.audio.playbackRate = Number(val)
  }
}
// 下载
function onDownload() {
  if (props.url) {
    base.downloadByUrl({ url: props.url, filename: props.url })
  }
}
// 滑块值变化
function onChange(val: number) {
  if (sound?.audio) {
    sound.audio.currentTime = (val / 100) * state.total
  }
}
// 时间格式化
function timeFmt(second: number) {
  if (second === 0) {
    return '0:00:00'
  }
  second = parseInt(second.toString())
  const hours = Math.floor(second / 3600)
  second = second - hours * 3600
  const mimute = Math.floor(second / 60)
  second = second - mimute * 60
  return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
}
</script>

<style scoped lang="scss">
.audio-box {
  display: flex;
  align-items: center;
  .slider-box {
    flex: 1;
    margin: 0 18px;
  }
  .dropdown-box {
    cursor: pointer;
    width: 35px;
  }
}
.time-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding: 0 43px;
}
</style>
