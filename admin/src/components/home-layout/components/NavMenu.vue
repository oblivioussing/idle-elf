<template>
  <div class="home-nav-menu">
    <el-menu
      class="menu-box"
      :collapse="props.isCollapse"
      :default-active="state.path"
      ref="menuRef"
      unique-opened
      @open="onMenuOpen">
      <el-sub-menu v-for="item in menus" :key="item.path" :index="item.path">
        <template #title>
          <icon-font :icon="icon(item.meta?.icon)"></icon-font>
          <span class="p-l-5">{{ item.meta?.title }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="child in item.children"
            :key="`${child.path}`"
            :index="`${item.path}/${child.path}`"
            @click="onTab(`${item.path}/${child.path}`)">
            {{ child.meta?.title }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
    <div class="version">版本号: {{ core.getVersion() }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { core } from '@/share'

// props
const props = defineProps<{
  isCollapse: boolean
}>()
// router
const route = useRoute()
const router = useRouter()
// var
let subIndex = ''
// state
const menuRef = ref(null)
const state = reactive({
  path: route.path
})
// computed
const menus = computed(() => {
  const routes = router.options.routes
  return routes.filter((item) => {
    const isIndex = ['/'].includes(item.path)
    if (item.children) {
      item.children = item.children.filter((item) => {
        return item.path.indexOf('/index') >= 0
      })
    }
    return item.children?.length && !isIndex
  })
})
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
// 菜单切换
function onTab(path: string) {
  router.push({ path })
}
// sub-menu 展开的回调
function onMenuOpen(index: string) {
  subIndex = index
}
// 图标
function icon(icon?: unknown) {
  return icon as string
}
</script>

<style scoped lang="scss">
.home-nav-menu {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-right: 1px;
  .menu-box {
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
    border-top: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    font-size: 12px;
    padding: 5px 0;
    text-align: center;
  }
}
</style>
