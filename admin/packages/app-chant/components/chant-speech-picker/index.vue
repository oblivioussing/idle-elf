<template>
  <chant-base-picker
    :id="state.id"
    :code="state.code"
    :name="state.name"
    :disabled="props.disabled"
    :sys-code="props.sysCode"
    :tenant-id="props.tenantId"
    :query="props.query"
    :placeholder="props.placeholder || tg('common.speech')"
    :columns="columns"
    :dict="dict"
    :lang="lang"
    :path="props.apiUrl || Api.dm + 'dm/findSpeechListByTenant'"
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
  code?: string
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
const emit = defineEmits(['change', 'update:id', 'update:code', 'update:name'])
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// state
const state = reactive({
  id: props.id,
  code: props.code,
  name: props.name
})
// watch
watch(
  () => props.id,
  (value) => {
    if (!value) {
      state.name = undefined
      state.code = undefined
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
watch(
  () => props.code,
  () => {
    state.code = props.code
  }
)
// change
function onChange(row: { id: string; speechCode: string; speechName: string }) {
  state.id = row.id
  state.code = row.speechCode
  state.name = row.speechName
  emit('update:id', row.id)
  emit('update:code', row.speechCode)
  emit('update:name', row.speechName)
  emit('change', row)
}
</script>

<style scoped lang="scss"></style>
