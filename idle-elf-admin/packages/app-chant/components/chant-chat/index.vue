<template>
  <div class="chant-chat">
    <div class="container">
      <div v-for="item in props.list" class="item">
        <div
          class="content"
          :class="{
            other: item.role === '1',
            self: item.role === '2'
          }">
          <el-avatar :size="30" :src="item.role === '1' ? BotImg : PersonImg">
          </el-avatar>
          <div class="text-wrap">
            <div class="text-box">
              <div class="triangle"></div>
              {{ item[props.contentKey] }}
            </div>
            <div class="datetime">{{ format.dateTime(item[dateTime]) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!props.readonly" class="enter-box toolbar">
      <el-input
        v-model="state.text"
        :autosize="{ minRows: 1, maxRows: 4 }"
        type="textarea"
        :value="state.text"
        @keydown.alt.enter.native="onLineFeed"
        @keydown.meta.enter.native="onLineFeed"
        @keydown.shift.enter.native="onLineFeed"
        @keydown.ctrl.enter.native="onLineFeed"
        @keydown.enter.exact.native="onEnter">
      </el-input>
      <el-button class="send-btn" type="primary" @click="onSend">
        {{ t('send') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import BotImg from './assets/img_bot.png'
import PersonImg from './assets/img_person.png'
import { format } from '../../share'

type Data = {
  role: '1' | '2'
  [key: string]: any
}
interface Props {
  contentKey?: string
  dateTime?: string
  list?: Data[]
  readonly?: boolean
}
// props
const props = withDefaults(defineProps<Props>(), {
  contentKey: 'content',
  dateTime: 'createTime',
  readonly: true
})
// emits
const emits = defineEmits(['send'])
// i18n
const { t } = useI18n({
  messages: {
    en: { send: 'send' },
    zh: { send: '发送' }
  }
})
// state
const state = reactive({
  text: ''
})
// 发送
function onSend() {
  emits('send', state.text)
  state.text = ''
}
// 回车
function onEnter(event: Event) {
  event.preventDefault()
  onSend()
}
// 换行
function onLineFeed(event: Event) {
  state.text = `${state.text} \n`
  event.preventDefault()
}
</script>

<style scoped lang="scss">
@import '@chant/style/mixin.scss';
@import '@chant/style/var.scss';

.chant-chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  .container {
    @include scroll-beautify;
    flex: 1;
    padding-right: 5px;
    .item {
      .content {
        display: flex;
        &.other {
          margin-right: 40px;
          .text-box {
            margin-left: 10px;
            .triangle {
              border-right-color: $color-gray;
              left: -15px;
            }
          }
          .datetime {
            margin-left: 10px;
          }
        }
        &.self {
          flex-direction: row-reverse;
          margin-left: 40px;
          .text-wrap {
            text-align: right;
          }
          .text-box {
            margin-right: 10px;
            .triangle {
              border-left-color: $color-gray;
              right: -15px;
            }
          }
          .datetime {
            margin-right: 10px;
          }
        }
        .text-wrap {
          flex: 1;
        }
        .text-box {
          background-color: $color-gray;
          border-radius: 5px;
          color: $color-black2;
          display: inline-block;
          font-size: 14px;
          padding: 5px;
          position: relative;
          text-align: left;
          .triangle {
            border: 8px solid transparent;
            position: absolute;
            top: 5px;
          }
        }
        .datetime {
          color: $color-gray2;
          line-height: 20px;
          margin-top: 5px;
          font-size: 12px;
        }
      }
    }
    .item + .item {
      margin-top: 10px;
    }
  }
  .enter-box {
    display: flex;
    align-items: flex-end;
    margin-top: 5px;
    .send-btn {
      height: 28px;
      margin-left: 5px;
    }
  }
}
</style>
