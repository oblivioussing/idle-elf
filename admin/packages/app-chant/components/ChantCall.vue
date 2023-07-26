<template>
  <div class="flex-align-center" :class="{ 'flex-center': props.center }">
    <span v-if="props.showPhone" class="p-r-5">{{ props.phone || '-' }}</span>
    <div
      v-if="hasShowCall()"
      :class="{
        'bg-primary': props.bg === 'primary',
        'bg-white': props.bg === 'white',
        'call-box': props.box,
        hangup: props.type === 'hangup',
        answer: props.type === 'answer'
      }">
      <el-tooltip
        effect="dark"
        :content="content"
        :disabled="!props.content"
        placement="bottom">
        <i @click.stop="onClick" class="iconfont" :class="[iconType()]"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCallStore } from '../store'

interface Props {
  bg?: 'primary' | 'white' // 背景色
  box?: boolean // 修饰层
  center?: boolean // 居中
  content?: string // tooltip内容
  phone?: string // 拨打的号码
  showCall?: boolean // 显示拨打按钮
  showPhone?: boolean // 显示号码
  type?: 'hangup' | 'answer' | 'phone' | 'message' // 类型
}
// props
const props = withDefaults(defineProps<Props>(), {
  bg: 'primary',
  box: true,
  center: false,
  showCall: true,
  type: 'phone'
})
// emit
const emit = defineEmits(['click'])
// click
function onClick() {
  if (props.phone) {
    const callStore = useCallStore()
    callStore.phone = props.phone
  }
  emit('click')
}
// 图标类型
function iconType() {
  const map = {
    hangup: 'icon-hangup',
    phone: 'icon-call-copy',
    message: 'icon-comment',
    answer: 'icon-call-copy'
  }
  return map[props.type]
}
// 是否先拨打按钮
function hasShowCall() {
  // 如果需要显示号码,但号码为空,则不显示拨打按钮
  if (props.showPhone && !props.phone) {
    return false
  }
  return props.showCall
}
</script>

<style scoped lang="scss">
@import '../style/var.scss';
.call-box {
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  text-align: center;
  width: 24px;
  &:active {
    opacity: 0.5;
  }
  // 挂断
  &.hangup {
    border-radius: 50%;
    background-color: $color-red;
    .iconfont {
      color: $color-white;
    }
  }
  // 接听
  &.answer {
    border-radius: 50%;
    background-color: $color-green1;
    .iconfont {
      color: $color-white;
    }
  }
}
.iconfont {
  color: $color-white;
}
.bg-primary {
  background-color: $color-base;
  .iconfont {
    color: $color-white;
  }
}
.bg-white {
  background-color: $color-white;
}
.iconfont {
  color: $color-base;
  cursor: pointer;
  font-size: 20px;
}
</style>
