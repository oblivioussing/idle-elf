<template>
  <el-dialog
    v-model="vModel"
    class="chant-dialog"
    :close-on-click-modal="false"
    :title="props.title">
    <slot></slot>
    <template #footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

// props
const props = defineProps<{
  modelValue: boolean
  title: string
}>()
// emits
const emits = defineEmits(['update:modelValue'])
// use
const vModel = useVModel(props, 'modelValue', emits)
</script>

<style lang="scss">
.chant-dialog {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 84vh;
  margin: 8vh auto;
  overflow: hidden;
  .el-dialog__body {
    box-sizing: border-box;
    flex: 1;
    overflow: auto;
    padding: 0 15px;
  }
  .el-dialog__footer {
    box-sizing: border-box;
    padding-top: 5px;
    padding-bottom: 15px;
  }
}
</style>
