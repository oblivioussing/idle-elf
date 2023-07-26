<template>
  <el-config-provider :locale="state.locale" size="small">
    <!-- header -->
    <nav-bar v-model="state.isCollapse"></nav-bar>
    <!-- body -->
    <div class="home-body">
      <!-- 菜单栏 -->
      <nav-menu :isCollapse="state.isCollapse"> </nav-menu>
      <!-- container -->
      <div class="home-container">
        <!-- tab -->
        <nav-tab></nav-tab>
        <!-- 路由视图 -->
        <router-view #="{ Component }">
          <keep-alive :include="state.keeps">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { bus } from '@chant/share'
import { useAppStore } from '../../store'
import { Bus } from '../../enum'
import NavBar from './components/NavBar.vue'
import NavMenu from './components/NavMenu.vue'
import NavTab from './components/NavTab.vue'

// use
const appStore = useAppStore()
// var
const langMap = {
  zh: zhCn,
  en: undefined
}
// state
const state = reactive({
  isCollapse: false, // 是否水平折叠收起菜单
  locale: langMap[appStore.lang],
  keeps: []
})
// 监听事件
bus.on(Bus.HomeKeeps, (arr) => {
  state.keeps = arr as never[]
})
</script>

<style scoped lang="scss">
.home-body {
  display: flex;
  height: calc(100vh - 45px);
  .home-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 5px;
  }
}
</style>
