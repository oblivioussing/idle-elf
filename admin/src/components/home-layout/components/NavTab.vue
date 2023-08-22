<template>
  <el-tabs
    v-model="state.path"
    type="card"
    @tab-click="onTab"
    @tab-remove="onTabRemove"
    class="nav-tab">
    <el-tab-pane
      v-for="(item, index) in state.tabs"
      :key="index"
      :label="item.title"
      :name="item.path"
      :closable="item.path !== '/'">
      <template #label>
        <el-dropdown
          ref="dropdownRef"
          trigger="contextmenu"
          :id="item.path"
          @visible-change="onVisibleChange($event, item.path)"
          @command="onCommand($event, item.path)">
          <span>{{ item.title }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="close">关闭</el-dropdown-item>
              <el-dropdown-item command="closeOther">
                关闭其他
              </el-dropdown-item>
              <el-dropdown-item command="closeAll">关闭所有</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Bus, StorageEnum } from '@/enum'
import { base, bus, storage } from '@/share'
import { useAppStore } from '@/store'
import { useChaoser } from '@/use'

type PathMapping = {
  path: string
  title: string
  name: string
}

// store
const appStore = useAppStore()
// router
const route = useRoute()
const router = useRouter()
// chaoser
const chaoser = useChaoser()
// var
const indexRaw = {
  path: '/',
  title: '首页',
  name: '/'
}
const tabs = (storage.getSession(StorageEnum.HomeNavTab) || [
  indexRaw
]) as PathMapping[]
// ref
const dropdownRef = ref()
// state
const state = reactive({
  path: route?.path,
  tabs: tabs
})
// 初始化
onMounted(() => {
  // 路由变化
  routerChange()
  // 通知外部keeps发生了变化
  busKeeps()
})
// 监听页面关闭
bus.on(Bus.ClosePage, (path) => {
  path = path || route.path
  onTabRemove(path as string)
})
// 监听所有页面关闭
bus.on(Bus.CloseAllPage, () => {
  onRemoveAll()
})
// 监听tabs变化
watch(
  () => [...state.tabs],
  () => {
    storage.setSession(StorageEnum.HomeNavTab, state.tabs)
    // 通知外部keeps发生了变化
    busKeeps()
  }
)
// 监听路由变化
watch(() => route?.path, routerChange)
// 路由变化
function routerChange() {
  const path = route?.path
  const index = state.tabs.findIndex((item) => item?.path === path)
  // 跳转的路由存在于tabs中
  if (index > -1) {
    state.path = path
    return
  }
  // 排除的页面
  const excludeList = ['/404', '/login']
  if (excludeList.includes(route.path)) {
    return
  }
  // meta
  const meta = chaoser.getMetaByPath()
  // tabs
  if (meta) {
    state.tabs.push({
      path: route.path,
      title: meta?.title as string,
      name: getName(path)
    })
  }
  state.path = route.path
}
// 获取name
function getName(path: any) {
  const name = path?.replace(/^\/|\/$/g, '')
  return name?.replace(/\//g, '-')
}
// 通知外部keeps发生了变化
function busKeeps() {
  let keeps = state.tabs.map((item) => {
    return item.name
  })
  bus.emit(Bus.HomeKeeps, keeps)
}
// tab切换
function onTab(row: any) {
  const path = row.paneName
  router.push({ path })
}
// tab删除
function onTabRemove(path: string) {
  const index = state.tabs.findIndex((item) => item?.path === path)
  if (index < 0) {
    return
  }
  state.tabs.splice(index, 1)
  // 移除路由参数
  base.removeRouterQuery(path)
  // 跳转至父页面
  const parentPath = base.getParentPath(path)
  if (parentPath) {
    const inTab = state.tabs.some((item) => item.path === parentPath)
    if (inTab) {
      router.push({ path: parentPath })
      return
    }
  }
  // 关闭的当前页面则自动跳转至前一个页面
  if (state.path === path) {
    path = state.tabs[index - 1]?.path || '/'
    router.push({ path })
  }
}
// 下拉菜单显示
function onVisibleChange(visible: boolean, path: string) {
  if (visible) {
    dropdownRef.value.forEach((item: any) => {
      if (item.id !== path) {
        item.handleClose()
      }
    })
  }
}
// 下拉菜单选择
function onCommand(command: string, path: string) {
  if (command === 'close') {
    onTabRemove(path)
  } else if (command === 'closeOther') {
    onRemoveOther(path)
  } else {
    onRemoveAll()
  }
}
// 关闭其他
function onRemoveOther(path: string) {
  const row = state.tabs.find((item) => item?.path === path) as PathMapping
  if (row.path === '/') {
    state.tabs = [row]
  } else {
    state.tabs = [indexRaw, row]
  }
  // 路由参数
  const routerQuery = storage.getSession(StorageEnum.RouterQuery) as any
  if (routerQuery) {
    const pathQuery = routerQuery[path]
    const map = {} as any
    map[path] = pathQuery
    storage.setSession(StorageEnum.RouterQuery, map)
  }
  router.push({ path: row?.path })
}
// 关闭所有
function onRemoveAll() {
  state.tabs = [indexRaw]
  // 路由参数
  storage.setSession(StorageEnum.RouterQuery, {})
  router.push({ path: '/' })
}
</script>

<style lang="scss">
.nav-tab {
  .el-tabs__item {
    &.is-active {
      .el-tooltip__trigger {
        color: #409eff;
      }
    }
    .el-dropdown {
      line-height: inherit;
      .el-tooltip__trigger {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}
</style>
