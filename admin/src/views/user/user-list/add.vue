<template>
  <chant-form v-model="state" type="add" @ref="former.bindFormInstance">
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
  ...former.state,
  dict,
  lang,
  model
})
// 保存
function onSave() {
  former.save('xx/xxx', state)
}
</script>

<style scoped lang="scss"></style>
