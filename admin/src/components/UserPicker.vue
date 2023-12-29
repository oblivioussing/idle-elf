<template>
  <chant-picker-button
    v-model:id="id"
    v-model:text="text"
    v-model:visible="visible"
    placeholder="用户">
  </chant-picker-button>
  <chant-table-picker
    v-model="visible"
    :columns="columns()"
    :dict="dict"
    :lang="lang"
    title="用户"
    @change="onChange">
  </chant-table-picker>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVModels } from '@vueuse/core'
import { columns, dict, lang } from '@/views/user/user-list/share'

// props
const props = defineProps<{
  id: string
  text: string
}>()
// emits
const emits = defineEmits(['update:id', 'update:text'])
// use
const { id, text } = useVModels(props, emits)
// ref
const visible = ref(false)
// change
function onChange(row: any) {
  text.value = row.name
}
</script>

<style scoped lang="scss"></style>
