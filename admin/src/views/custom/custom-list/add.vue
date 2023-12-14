<template>
  <chant-form v-model="state" @save="onSave" type="add"></chant-form>
</template>

<script setup lang="ts" name="custom-custom-list-add">
import { reactive } from 'vue'
import { useFormer } from '@/use'
import { model } from './share'

// use
const former = useFormer()
// state
const state = reactive({
  ...former.state,
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
