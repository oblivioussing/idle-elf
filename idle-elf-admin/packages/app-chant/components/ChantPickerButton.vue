<template>
  <el-input
    v-model="state.name"
    readonly
    v-bind="$attrs"
    class="picker-input"
    :disabled="props.disabled"
    :prefix-icon="Search"
    :placeholder="props.placeholder"
    @click="onClick">
    <template #suffix>
      <div
        v-if="state.name && props.disabled !== true"
        class="flex-center"
        @click="onClear">
        <el-icon :size="14" class="pointer">
          <circle-close></circle-close>
        </el-icon>
      </div>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import { CircleClose, Search } from '@element-plus/icons-vue'

// props
const props = defineProps<{
  name?: string
  disabled?: boolean
  placeholder?: string
}>()
// emit
const emit = defineEmits(['click', 'clear'])
// state
const state = reactive({
  ...toRefs(props)
})
// 点击
function onClick() {
  emit('click')
}
// 清除
function onClear() {
  emit('clear')
}
</script>

<style scoped lang="scss"></style>
