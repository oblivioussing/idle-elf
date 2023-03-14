<template>
  <chant-dialog v-model="vModel" :title="props.title" :width="width">
    <div class="flex-center">
      <el-button
        v-for="(val, key) in props.data"
        :key="key"
        @click="onClick(key)"
        type="primary"
        size="default"
        class="m-b-20">
        {{ val }}
      </el-button>
    </div>
  </chant-dialog>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

// props
const props = defineProps<{
  data?: Record<string, any>
  modelValue: boolean // visible
  title?: string // 标题
}>()
// emit
const emit = defineEmits(['change', 'update:modelValue'])
// VModel
const vModel = useVModel(props, 'modelValue', emit)
// var
let width = ''
if (props.data) {
  width = 125 * Object.keys(props.data).length + 'px'
}
// 点击
function onClick(val: string) {
  emit('change', val)
}
</script>

<style scoped lang="scss"></style>
