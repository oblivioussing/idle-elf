<template>
  <chant-base-picker
    :id="state.id"
    :name="state.name"
    :disabled="props.disabled"
    :sys-code="props.sysCode"
    :tenant-id="props.tenantId"
    :query="props.query"
    :placeholder="props.placeholder || tg('common.case')"
    :columns="columns"
    :dict="dict"
    :lang="lang"
    :path="Api.crmmu + 'wod/findPageCaseAndStatistical'"
    :mode="props.mode"
    :button-text="props.buttonText"
    :visible="props.visible"
    @change="onChange"
    @visible-change="onVisible">
  </chant-base-picker>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
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
  disabled?: boolean
  placeholder?: string
  mode?: 'button' | 'input' | 'picker' // 展现形式
  buttonText?: string // 按钮显示文字
  visible?: boolean // 直接显示picker
}
// props
const props = withDefaults(defineProps<Props>(), {})
// emit
const emit = defineEmits([
  'change',
  'update:id',
  'update:name',
  'update:visible'
])
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// state
const state = reactive({
  id: props.id,
  name: props.name
})
// change
function onChange(row: { id: string; orgName: string }) {
  state.id = row.id
  state.name = row.orgName
  emit('update:id', row.id)
  emit('update:name', row.orgName)
  emit('change', row)
}
// visible change
function onVisible(val: boolean) {
  emit('update:visible', val)
}
</script>

<style scoped lang="scss"></style>
