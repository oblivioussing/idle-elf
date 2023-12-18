<template>
  <chant-form v-model="state" type="add" @save="onSave"></chant-form>
</template>

<script setup lang="ts" name="user-user-list-add">
import { reactive } from 'vue'
import { useFormer } from '@/use'
import { lang, model } from './share'

// use
const former = useFormer()
// state
const state = reactive({
  ...former.state,
  lang,
  model
})
// created
former.created(() => {}, state)
// 保存
function onSave() {
  former.save('xx/xxx', state)
}
</script>

<style scoped lang="scss"></style>
