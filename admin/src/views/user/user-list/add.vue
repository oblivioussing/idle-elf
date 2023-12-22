<template>
  {{ state.form }}
  <chant-form v-model="state" type="add"></chant-form>
  <chant-form-footer></chant-form-footer>
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
// created
former.created(() => {}, state)
// 保存
function onSave() {
  former.save('xx/xxx', state)
}
</script>

<style scoped lang="scss"></style>
