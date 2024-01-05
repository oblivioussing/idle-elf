<template>
  <chant-form
    v-model="state"
    :dict="dict"
    :lang="lang"
    :model="model()"
    @instance="former.bindInstance">
  </chant-form>
  <chant-form-footer v-model="state" @save="onSave"></chant-form-footer>
</template>

<script setup lang="ts" name="user-user-list-add">
import { reactive } from 'vue'
import { useFormer } from '@/use'
import { dict, lang, model } from './share'

// use
const former = useFormer()
// state
const state = reactive({
  ...former.state
})
// create
former.created(() => {
  if (state.pageType === 'copy-add') {
    // 获取详情
    getDetail()
  }
}, state)
// 获取详情
function getDetail() {
  former.getData('user/detail', state)
}
// 保存
function onSave() {
  former.save('user/add', state)
}
</script>

<style scoped lang="scss"></style>
