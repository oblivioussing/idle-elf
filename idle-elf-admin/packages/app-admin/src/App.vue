<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAppStore } from 'chant'

// use
const appStore = useAppStore()
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// subscribe
appStore.$subscribe((_, _state) => {
  // 设置标题
  setTitle()
})
// 设置标题
setTitle()
function setTitle() {
  document.title = tg('company.project')
}
</script>

<style lang="scss">
@import 'chant/style/base.scss';
@import 'chant/style/core.scss';
@import 'chant/style/element.scss';

#app {
  height: 100vh;
  overflow: hidden;
}
</style>
