<template>
  <chant-base-picker
    :id="state.id"
    :name="state.name"
    :disabled="props.disabled"
    :sys-code="props.sysCode"
    :tenant-id="props.tenantId"
    :query="props.query"
    :placeholder="props.placeholder || tg('common.task')"
    :columns="columns"
    :dict="dict"
    :lang="lang"
    :path="props.apiUrl || Api.crm + 'tsk/findCallTask'"
    @change="onChange">
  </chant-base-picker>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { columns, dict, lang } from './share'
import { Api } from '../../api'
import ChantBasePicker from '../ChantBasePicker.vue'

interface Props {
  id?: string
  name?: string
  sysCode?: string
  tenantId?: string
  query?: Record<string, any>
  apiUrl?: string
  disabled?: boolean
  placeholder?: string
}
// props
const props = withDefaults(defineProps<Props>(), {})
// emit
const emit = defineEmits(['change', 'update:id', 'update:name'])
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// state
const state = reactive({
  id: props.id,
  name: props.name
})
// watch
watch(
  () => props.id,
  (value) => {
    if (!value) {
      state.name = undefined
      state.id = undefined
      return
    }
    state.id = props.id
  }
)
watch(
  () => props.name,
  () => {
    state.name = props.name
  }
)
// change
function onChange(row: { id: string; name: string }) {
  state.id = row.id
  state.name = row.name
  emit('update:id', row.id)
  emit('update:name', row.name)
  emit('change', row)
}
</script>

<style scoped lang="scss"></style>
