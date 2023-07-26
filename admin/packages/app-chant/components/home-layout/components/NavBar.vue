<template>
  <div class="home-header">
    <div class="left">
      <img :src="appStore.logo" class="logo-ic" />
      <div>{{ tg('company.project') }}</div>
      <img @click="onCollapse" src="../assets/ic_menu.png" class="menu-ic" />
    </div>
    <!-- 电话工具条 -->
    <call-toolbar></call-toolbar>
    <div class="right">
      <!-- 语言 -->
      <el-dropdown @command="onLang">
        <div class="dropdown">
          <div>{{ tg('common.lang') }}</div>
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
      <!-- 岗位 -->
      <el-dropdown
        v-if="userStore.defaultOrgName"
        @visible-change="getOrgList"
        @command="changeOrg">
        <div class="dropdown">
          <div>{{ userStore.defaultOrgName }}</div>
          <el-icon class="arrow-down-icon">
            <caret-bottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in state.orgs" :command="item">
              {{ item.orgName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出 -->
      <el-dropdown @command="onQuit">
        <div class="dropdown">
          <div class="t-a-c">
            <div>{{ operator?.loginName }}</div>
            <div>{{ operator?.userInfoBase?.userInfoName }}</div>
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
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { CaretBottom } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { shiki, Api } from '@chant/api'
import { Bus, LangEnum, StorageEnum } from '@chant/enum'
import { vuei18n } from '@chant/plugs/i18n'
import { base, bus, core, storage } from '@chant/share'
import { useAppStore, useUserStore, userDefault } from '@chant/store'
import CallToolbar from './call-toolbar/index.vue' // 电话工具条

// props
const props = defineProps<{
  modelValue: boolean
}>()
// emit
const emit = defineEmits(['update:modelValue'])
// use
const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()
// i18n
const { t } = useI18n({
  messages: {
    en: { quit: 'quit' },
    zh: { quit: '退出' }
  }
})
const { t: tg } = useI18n({ useScope: 'global' })
// var
const operator = userStore.operator
// state
const state = reactive({
  orgs: [] as any[],
  isCollapse: props.modelValue
})
// init
getOrgList(true) // 获取岗位列表
// 切换
function onCollapse() {
  state.isCollapse = !state.isCollapse
  emit('update:modelValue', state.isCollapse)
}
// 设置语言
function onLang(lang: LangEnum) {
  storage.setLocal(StorageEnum.Lang, lang)
  appStore.lang = lang
  vuei18n.global.locale.value = lang
}
// 获取岗位列表
async function getOrgList(visible: boolean) {
  if (!visible) {
    return
  }
  const { data } = await shiki.getData(Api.cs + 'ath/getOrgList')
  if (data) {
    state.orgs = data
  }
}
// 切换岗位
async function changeOrg(row: any) {
  const path = Api.cs + 'ath/changeOrg'
  const code = await shiki.postCode(path, { id: row.id })
  if (shiki.isSuccess(code)) {
    userStore.defaultOrgName = row.orgName
    const status = await userStore.updateAuth()
    if (status) {
      // 关闭所有页面
      bus.emit(Bus.CloseAllPage)
      setTimeout(() => {
        location.href = '/'
      }, 300)
    }
  }
}
// 退出
async function onQuit() {
  const isPsa = core.isPsa()
  const path = isPsa ? Api.cs + 'ath/psaLogout' : Api.cs + 'ath/ptaLogout'
  const code = await shiki.postCode(path)
  if (shiki.isSuccess(code)) {
    storage.rmLocal(StorageEnum.User)
    userStore.$state = base.clone(userDefault)
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
@import '@chant/style/var.scss';

.home-header {
  background-color: $color-black;
  color: $color-white;
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
    .dropdown {
      color: $color-white;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-left: 10px;
      .arrow-down-icon {
        color: $color-gray2;
      }
    }
  }
}
</style>
