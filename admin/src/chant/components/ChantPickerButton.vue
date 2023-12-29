<template>
  <el-input
    class="chant-picker-input"
    :disabled="props.disabled"
    :placeholder="tips"
    :prefix-icon="Search"
    readonly
    :value="text"
    @click="visible = true">
    <template #suffix>
      <div
        v-if="props.text && props.disabled !== true"
        class="clear-box"
        @click="onClear">
        <el-icon :size="14" class="pointer">
          <circle-close></circle-close>
        </el-icon>
      </div>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CircleClose, Search } from '@element-plus/icons-vue'
import { useVModels } from '@vueuse/core'

// props
const props = defineProps<{
  disabled?: boolean
  id: string
  placeholder?: string
  text: string
  visible: boolean
}>()
// emits
const emits = defineEmits([
  'clear',
  'update:id',
  'update:text',
  'update:visible'
])
// use
const { t: tg } = useI18n({ useScope: 'global' })
const { id, text, visible } = useVModels(props, emits)
// computed
const tips = computed(() => {
  return tg('tips.select') + props.placeholder
})
// 清空
function onClear() {
  id.value = ''
  text.value = ''
  emits('clear')
}
</script>

<style scoped lang="scss">
.chant-picker-input:not(.is-disabled) {
  .clear-box {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  :deep(.el-input__prefix) {
    cursor: pointer;
  }
  :deep(.el-input__inner) {
    cursor: pointer;
  }
}
</style>
