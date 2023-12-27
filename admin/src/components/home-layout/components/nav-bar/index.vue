<template>
  <div class="home-header">
    <div class="left">
      <img src="/image/logo.png" class="logo-ic" />
      <div>{{ tg('app.project') }}</div>
      <img src="./img/ic_menu.png" class="menu-ic" @click="onCollapse" />
    </div>
    <div class="right">
      <!-- 语言 -->
      <el-dropdown @command="onLang">
        <div class="dropdown">
          <div>{{ lang }}</div>
          <el-icon class="arrow-down-icon">
            <caret-bottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="LangEnum.Zh">中文</el-dropdown-item>
            <el-dropdown-item :command="LangEnum.En">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出 -->
      <el-dropdown @command="onQuit">
        <div class="dropdown">
          <el-avatar :src="avatarUrl" :size="25">
            <img
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </el-avatar>
          <div class="t-a-c m-l-5">
            <div>登录名</div>
            <div>姓名</div>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="quit">{{ t('quit') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { CaretBottom } from '@element-plus/icons-vue'
import { LangEnum, StorageEnum } from '@/enum'
import { vuei18n } from '@/plugs'
import { useAppStore, useUserStore } from '@/store'
import { storage } from '@/utils'

// props
const props = defineProps<{
  modelValue: boolean
}>()
// emits
const emits = defineEmits(['update:modelValue'])
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
const { t } = useI18n({
  messages: {
    en: {
      quit: 'quit'
    },
    zh: {
      quit: '退出'
    }
  }
})
// router
const router = useRouter()
// store
const appStore = useAppStore()
const userStore = useUserStore()
// state
const state = reactive({
  orgs: [] as any[],
  isCollapse: props.modelValue
})
// computed
const avatarUrl = computed(() => {
  return ''
})
const lang = computed(() => {
  const map = {
    en: 'English',
    zh: '中文'
  }
  return map[appStore.state.lang]
})
// 切换
function onCollapse() {
  state.isCollapse = !state.isCollapse
  emits('update:modelValue', state.isCollapse)
}
// 设置语言
function onLang(lang: LangEnum) {
  storage.setLocal(StorageEnum.Lang, lang)
  appStore.state.lang = lang
  vuei18n.global.locale.value = lang
}
// 退出
async function onQuit() {
  storage.rmLocal(StorageEnum.User)
  userStore.$state = {} as any
  router.push('/login')
}
</script>

<style scoped lang="scss">
.home-header {
  background-color: #333744;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  height: 45px;
  padding: 0 10px;
  .left {
    display: flex;
    align-items: center;
    font-size: 18px;
    .logo-ic {
      margin-right: 5px;
      width: 20px;
    }
    .menu-ic {
      margin-left: 5px;
      cursor: pointer;
      width: 25px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .badge {
      cursor: pointer;
      top: -10px;
      right: -5px;
    }
    .dropdown {
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-left: 10px;
      .arrow-down-icon {
        color: #999999;
      }
    }
  }
}
</style>
