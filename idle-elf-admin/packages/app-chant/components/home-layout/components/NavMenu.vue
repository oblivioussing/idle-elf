<template>
  <div class="home-nav-menu">
    <el-menu
      ref="menuRef"
      :default-active="state.path"
      :collapse="props.isCollapse"
      background-color="#42485b"
      text-color="#ffffff"
      @open="onMenuOpen"
      unique-opened
      class="menu-box">
      <el-sub-menu
        v-for="item in menus"
        :key="(item.meta?.funCode as string)"
        :index="(item.meta?.funCode as string)">
        <template #title>
          <i class="iconfont" :class="item.meta?.icon"></i>
          <span :class="{ 'p-r-40': !props.isCollapse }">
            {{ title(item.meta) }}
          </span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="child in item.children"
            :key="`${child.path}`"
            :index="`${child.path}`"
            @click="onTab(`${child.path}`)">
            {{ title(child.meta) }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
    <div class="version">{{ t('version') }}: {{ core.getVersion() }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { FunType, LangEnum } from '@chant/enum'
import { core } from '@chant/share'
import { useAppStore, useUserStore } from '@chant/store'

// props
const props = defineProps<{
  isCollapse: boolean
}>()
// router
const route = useRoute()
const router = useRouter()
// store
const appStore = useAppStore()
const userStore = useUserStore()
// i18n
const { t } = useI18n({
  messages: {
    en: { version: 'version No' },
    zh: { version: '版本号' }
  }
})
// var
let menus = userStore.menuList as RouteRecordRaw[]
menus = menus.filter((item) => {
  item.children = item.children?.filter((child) => {
    const list = [FunType.SecondLevelMenu, FunType.RemoteMenu]
    const funType = child.meta?.funType as FunType
    return list.includes(funType)
  })
  return item.meta?.funType === FunType.FirstLevelMenu
})
let subIndex = ''
// state
const menuRef = ref(null)
const state = reactive({
  path: route.path
})
// computed
const locale = computed(() => appStore.lang)
// watch
watch(
  () => route.path,
  () => {
    state.path = route.path
    // path为/折叠menu
    if (state.path === '/' && subIndex) {
      const menu = menuRef.value as any
      menu?.close(subIndex)
    }
  }
)
// 标题
function title(meta?: any) {
  const { titleEn, titleZh } = meta || {}
  return locale.value === LangEnum.En ? titleEn : titleZh
}
// 菜单切换
function onTab(path: string) {
  router.push({ path })
}
// sub-menu 展开的回调
function onMenuOpen(index: string) {
  subIndex = index
}
</script>

<style scoped lang="scss">
@import '@chant/style/mixin.scss';
@import '@chant/style/var.scss';
.home-nav-menu {
  background-color: $color-black1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-right: 1px;
  .menu-box {
    @include scroll-beautify;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
    &.el-menu--collapse {
      width: inherit;
      & + .version {
        display: none;
      }
    }
    &:not(.el-menu--collapse) {
      width: 160px;
    }
  }
  .version {
    border-top: 1px solid rgba($color: $color-white, $alpha: 0.1);
    color: rgba($color: $color-white, $alpha: 0.5);
    text-align: center;
    font-size: 12px;
    padding: 5px 0;
  }
}
</style>
