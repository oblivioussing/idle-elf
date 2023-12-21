<template>
  <chant-button v-bind="$attrs" :icon="icon"></chant-button>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { CopyDocument, Delete, Edit, Plus } from '@element-plus/icons-vue'

// type
type IconType = 'copyDocument' | 'delete' | 'edit' | 'plus'
// props
const props = defineProps<{
  iconType: IconType
}>()
// computed
const icon = computed(() => {
  const map = {
    copyDocument: CopyDocument,
    delete: Delete,
    edit: Edit,
    plus: Plus
  }
  return map[props.iconType]
})
</script>
<style scoped lang="scss"></style>
