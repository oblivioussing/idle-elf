<template>
  <chant-base-picker
    :id="state.id"
    :name="state.name"
    :disabled="props.disabled"
    :sys-code="props.sysCode"
    :tenant-id="props.tenantId"
    :placeholder="props.placeholder || tg('common.product')"
    :columns="columns"
    :dict="dict"
    :lang="lang"
    :path="Api.crmmu + 'prod/findLoanProduct'"
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
  () => {
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
function onChange(row: { id: string; userInfoName: string }) {
  state.id = row.id
  state.name = row.userInfoName
  emit('update:id', row.id)
  emit('update:name', row.userInfoName)
  emit('change', row)
}
</script>

<style scoped lang="scss"></style>
