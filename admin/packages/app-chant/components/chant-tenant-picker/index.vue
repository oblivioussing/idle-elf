<template>
  <chant-base-picker
    :id="state.id"
    :name="state.name"
    :disabled="props.disabled"
    :placeholder="placeholderCpd"
    :columns="columns"
    :column-width="150"
    :dict="dict"
    :path="props.apiUrl || pathCpd"
    @change="onChange">
  </chant-base-picker>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { tenantClassify as lang } from '@chant/lang/business'
import { columns, dict } from './share'
import { Api } from '../../api'
import { TenantClassify } from '../../enum'
import ChantBasePicker from '../ChantBasePicker.vue'

interface Props {
  id?: string
  name?: string
  clearable?: boolean
  disabled?: boolean
  placeholder?: string
  apiUrl?: string
  tenantClassify?: TenantClassify // 租户类型
}
// props
const props = withDefaults(defineProps<Props>(), {
  clearable: false, // 是否可清空
  disabled: false, // 是否禁用
  tenantClassify: TenantClassify.Tenant // 默认为租户
})
// emit
const emit = defineEmits(['change', 'update:id', 'update:name'])
// i18n
const { t } = useI18n({ messages: lang })
// state
const state = reactive({
  id: props.id,
  name: props.name
})
// computed
const placeholderCpd = computed(() => {
  if (props.placeholder) {
    return props.placeholder
  } else {
    return tenantText.value
  }
})
const tenantText = computed(() => {
  const map = {
    agentTenant: 'agentTenant', // 人工外呼租户
    aiTenant: 'aiTenant', // 智能语音租户
    entrust: 'entrust', // 资产方
    saasCustomer: 'saasCustomer', // 公有云客户
    supplier: 'supplier', // 供应商
    tenant: 'tenant', // 租户
    workplace: 'workplace', // 职场
    organization: 'organization', // 组织
    masterWorkPlace: 'masterWorkPlace', // 集团职场
    masterSingleWorkPlace: 'masterSingleWorkPlace', // 所属职场
    workplaceTemplate: 'workplaceTemplate' // 职场模板
  }
  // 租户分类
  const tenantClassify = props.tenantClassify
  const label = map[tenantClassify]
  return t(label)
})
const pathCpd = computed(() => {
  const map = {
    agentTenant: Api.cs + 'ath/findWorkPlaceAgentTenant', // 人工外呼租户
    aiTenant: Api.cs + 'ath/findSaasAiTenant', // 智能语音租户
    entrust: Api.cs + 'ath/findEntrust', // 资产方
    saasCustomer: Api.cs + 'ath/findSaasCustomer', // 公有云客户
    supplier: Api.cs + 'ath/findSupplier', // 供应商
    tenant: Api.cs + 'ath/findTenant', // 租户
    workplace: Api.cs + 'ath/findWorkPlace', // 职场
    organization: Api.cs + 'ath/findOrg', // 组织
    masterWorkPlace: Api.cs + 'ath/findMasterWorkPlace', // 集团职场
    masterSingleWorkPlace: Api.cs + 'ath/findMasterSingleWorkPlace', // 所属职场
    workplaceTemplate: Api.cs + 'ath/findTemplateWorkPlace' // 模板职场
  }
  return map[props.tenantClassify]
})
// watch
watch(
  () => props.id,
  () => {
    state.id = props.id
    if (!state.id) {
      state.name = ''
    }
  }
)
watch(
  () => props.name,
  () => {
    state.name = props.name
  }
)
// change
function onChange(row: { id: string; tenantName: string }) {
  state.id = row.id
  state.name = row.tenantName
  emit('update:id', row.id)
  emit('update:name', row.tenantName)
  emit('change', row)
}
</script>

<style scoped lang="scss"></style>
