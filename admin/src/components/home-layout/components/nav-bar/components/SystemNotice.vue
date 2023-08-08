<template>
  <div class="system-notice-dialog">
    <el-dialog
      @opened="getUserUnreadCount"
      v-model="state.visible"
      :before-close="onClose"
      :show-close="false"
      top="45px">
      <!-- tabs -->
      <div class="tabs-box">
        <el-tabs
          v-model="state.active"
          stretch
          type="card"
          @tab-change="tabChange">
          <el-tab-pane name="0">
            <template #label>
              <div class="badge" v-if="state.totalNum.bizUnreadCount">
                {{ state.totalNum.bizUnreadCount }}
              </div>
              <div>{{ t('business') }}</div>
            </template>
          </el-tab-pane>
          <!-- <el-tab-pane name="1">
            <template #label>
              <div>{{ t('private') }}</div>
            </template>
          </el-tab-pane> -->
          <el-tab-pane name="2">
            <template #label>
              <div class="badge" v-if="state.totalNum.groupUnreadCount">
                {{ state.totalNum.groupUnreadCount }}
              </div>
              <div>{{ t('group') }}</div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- list -->
      <div
        v-loading="state.loading"
        class="list"
        v-scroll="[onScroll, { throttle: 300, offset: { bottom: 300 } }]">
        <div
          v-for="(item, key) in state.list"
          class="item"
          :key="key"
          @click="onItem(item)">
          <!-- 业务消息 -->
          <div class="business" v-if="state.active === '0'">
            <div class="ellipsis-2 title">
              <span v-if="item.topFlag === '1'" class="color-block">
                {{ t('top') }}
              </span>
              {{ item.noticeTitle }}
            </div>
            <div class="tile p-t-10">
              <div
                class="color-block"
                :style="{ 'background-color': typeColor(item.noticeType) }">
                {{ state.dict.noticeType[item.noticeType] }}
              </div>
              <div>{{ format.dateTime(item.noticeTime) }}</div>
              <div>{{ item.senderName }}</div>
            </div>
          </div>
          <!-- 业务消息 -->
          <div class="group-chat" v-if="state.active === '2'">
            <div class="unread-count">{{ item.unreadCount }}</div>
            <div class="flex">
              <div class="name ellipsis-1 p-r-5 flex-1">
                {{ item.chatRoomTitle }}
              </div>
              <div class="time">
                {{ format.dateTime(item.newestMessageTime) }}
              </div>
            </div>
            <div class="flex m-t-5">
              <div class="content ellipsis-1 p-r-5 flex-1">
                {{ item.newestSenderName }}: {{ item.newestMessage }}
              </div>
              <div class="type">
                <el-tag type="success">
                  {{ state.dict.chatRoomType[item.chatRoomType] }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
        <!-- loading -->
        <div
          v-if="state.loading"
          v-loading="state.loading"
          class="loading"></div>
      </div>
      <!-- empty -->
      <el-empty
        v-if="!state.list.length"
        class="gravity-center"
        :image-size="100">
      </el-empty>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { type UseScrollReturn } from '@vueuse/core'
import { vScroll } from '@vueuse/components'
import {
  bus,
  format,
  useLister,
  Api,
  ArticleTypeEnum,
  PagePathEnum
} from '@chant'

// props
const props = defineProps<{
  modelValue: boolean
}>()
// emits
const emits = defineEmits(['update:modelValue'])
// use
const lister = useLister()
// router
const router = useRouter()
// i18n
const { t } = useI18n({
  messages: {
    en: {
      business: 'business',
      private: 'private',
      group: 'group',
      top: '置顶'
    },
    zh: {
      business: '业务消息',
      private: '私聊消息',
      group: '群聊消息',
      top: '置顶'
    }
  }
})
// state
const state = reactive({
  ...lister.state,
  isFinish: false,
  active: '0',
  visible: props.modelValue,
  totalNum: {
    bizUnreadCount: 0, // 业务消息
    groupUnreadCount: 0, // 群聊消息
    privateUnreadCount: 0 // 私聊消息
  } as any
})
// watch
watch(
  () => props.modelValue,
  () => {
    state.visible = props.modelValue || false
  }
)
// 切换
function tabChange(e: any) {
  state.pages.pageNum = 1
  state.active = e
  getList()
}
// 获取消息列表
async function getUserUnreadCount() {
  const path = Api.im + 'msg/findUserUnreadCount'
  const data = await lister.getData(path, state, { custom: true })
  if (data) {
    const { bizUnreadCount, privateUnreadCount, groupUnreadCount } = data as any
    state.totalNum = data
    if (bizUnreadCount) {
      state.active = '0'
      getList()
    } else if (privateUnreadCount) {
      state.active = '1'
    } else if (groupUnreadCount) {
      state.active = '2'
    }
  }
}
// 获取消息列表
async function getList() {
  const pathMap = {
    0: Api.im + 'msg/findUserUnreadNotice', // 业务消息
    1: 'xxx',
    2: Api.im + 'msg/findUserUnreadChatRoom' // 群聊消息
  } as any
  const config = {
    dict: { noticeType: 'NoticeTypeEnum', chatRoomType: 'ChatRoomTypeEnum' },
    custom: true
  }
  const ret = (await lister.getData(
    pathMap[state.active],
    state,
    config
  )) as any
  state.list = state.list.concat(ret.pageData || [])
  if (ret.totalRecord === state.list.length) {
    state.isFinish = true
  }
}
// 滚动事件
function onScroll(row: UseScrollReturn) {
  if (state.loading || state.isFinish) {
    return
  }
  const isArrive = row.arrivedState.bottom
  const isDirect = row.directions.bottom
  if (isArrive && isDirect) {
    // 获取消息列表
    getList()
  }
}
// 消息点击
function onItem(row: any) {
  switch (state.active) {
    // 业务消息
    case '0':
      bus.emit(PagePathEnum.ArticleDetail, row.noticeBizId)
      router.push({
        path: PagePathEnum.ArticleDetail,
        query: { id: row.noticeBizId }
      })
      break
    // 群聊消息
    case '2':
      const path = PagePathEnum.ProjectDetail // 项目跟进
      const query = { id: row.chatRoomId }
      bus.emit(path, row.chatRoomId)
      router.push({ path, query })
      break
  }
  // 关闭
  onClose()
}
// 文章类型颜色
function typeColor(type: any) {
  const map = new Map([
    [ArticleTypeEnum.SystemRelease, '#F79570'], // 系统更新
    [ArticleTypeEnum.OperateInstruction, '#98A9F5'], // 操作教程
    [ArticleTypeEnum.SystemNotice, '#48A8B8'] // 公告
  ])
  return map.get(type)
}
// 关闭
function onClose() {
  state.visible = false
  emits('update:modelValue', false)
}
</script>

<style scoped lang="scss">
@import 'chant/style/mixin.scss';
@import 'chant/style/var.scss';

.system-notice-dialog {
  :deep(.el-dialog) {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 45px);
    position: absolute;
    right: 0;
    width: 400px;
  }
  :deep(.el-dialog__header) {
    height: 0;
    padding: 0;
  }
  :deep(.el-dialog__body) {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  .tabs-box {
    padding: 20px 50px 10px;
    :deep(.el-tabs__nav-wrap) {
      overflow: visible;
    }
    :deep(.el-tabs__header) {
      border-bottom: 0;
    }
    :deep(.el-tabs__nav-scroll) {
      overflow: visible;
    }
    :deep(.el-tabs__nav) {
      border-bottom: 1px solid var(--el-border-color-light);
      border-radius: 4px;
    }
    .badge {
      top: -10px;
      right: 5px;
    }
  }
  .list {
    @include scroll-beautify;
    background-color: $color-gray;
    flex: 1;
    font-size: 12px;
    padding-top: 10px;
    .item {
      background-color: $color-white;
      cursor: pointer;
      padding: 10px;
      .item + .item {
        border-top: 1px solid $color-gray3;
      }
      .business {
        .title {
          font-weight: bold;
          font-size: 16px;
        }
        .tile {
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .group-chat {
      position: relative;
      line-height: 24px;

      .unread-count {
        justify-content: center;
        background: #ff0000;
        transform: scale(0.9);
        align-items: center;
        color: $color-white;
        border-radius: 50px;
        position: absolute;
        display: flex;
        height: 16px;
        width: 16px;
        right: -5px;
        top: -15px;
      }
      .name {
        font-size: 16px;
      }
    }
  }
  .loading {
    height: 35px;
    :deep(.circular) {
      height: 20px;
      width: 20px;
    }
    :deep(.el-loading-spinner) {
      top: 80%;
    }
  }
}
</style>
