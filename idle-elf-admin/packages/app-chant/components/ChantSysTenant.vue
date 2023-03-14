<template>
  <!-- search -->
  <template v-if="props.type === 'search'">
    <!-- 系统类型 -->
    <chant-search-item v-if="isPsa" :content="t('sysCode')">
      <chant-select
        v-model="state.form.sysCode"
        :clearable="props.clearable"
        :data="sysCodeEnum"
        :disabled="props.sysDisabled"
        :placeholder="t('sysCode')"
        @change="onSysChange">
      </chant-select>
    </chant-search-item>
    <!-- 租户选择 -->
    <chant-search-item
      v-show="showTenantPicker()"
      :content="props.tenantTips || tg('common.tenant')">
      <chant-tenant-picker
        v-model:id="state.form.tenantId"
        v-model:name="state.form.tenantName"
        :api-url="props.apiUrl"
        :placeholder="props.tenantTips"
        :tenant-classify="props.tenantClassify"
        @change="onTenant">
      </chant-tenant-picker>
    </chant-search-item>
  </template>
  <!-- normal -->
  <template v-else-if="props.type === 'normal'">
    <!-- 系统类型 -->
    <chant-select
      v-if="isPsa"
      v-model="state.form.sysCode"
      :data="sysCodeEnum"
      :disabled="props.sysDisabled"
      :placeholder="t('sysCode')"
      @change="onSysChange">
    </chant-select>
    <!-- 租户选择 -->
    <span v-show="showTenantPicker()" class="p-l-10">
      <chant-tenant-picker
        v-model:id="state.form.tenantId"
        v-model:name="state.form.tenantName"
        :api-url="props.apiUrl"
        :placeholder="props.tenantTips"
        :tenant-classify="props.tenantClassify"
        @change="onTenant">
      </chant-tenant-picker>
    </span>
  </template>
  <!-- form -->
  <template v-else-if="props.type === 'form'">
    <chant-form-item v-if="isPsa" :label="t('sysCode')">
      <!-- 系统类型 -->
      <div v-if="props.readonly" class="form-item-text">
        {{ sysCodeEnum[state.form.sysCode as any] }}
      </div>
      <chant-select
        v-else
        v-model="state.form.sysCode"
        :data="sysCodeEnum"
        :disabled="!props.alterTenant"
        :placeholder="t('sysCode')"
        @change="onSysChange">
      </chant-select>
    </chant-form-item>
    <chant-form-item v-if="showTenantPicker()" :label="tenantText">
      <!-- 租户选择 -->
      <div v-if="props.readonly" class="form-item-text">
        {{ state.form.tenantName }}
      </div>
      <chant-tenant-picker
        v-else
        :api-url="props.apiUrl"
        :disabled="!props.alterTenant"
        :id="state.form.tenantId"
        :name="state.form.tenantName"
        :placeholder="props.tenantTips"
        :tenant-classify="props.tenantClassify"
        @change="onTenant">
      </chant-tenant-picker>
    </chant-form-item>
  </template>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { tenantClassify as lang } from '@chant/lang/business'
import { TenantClassify } from '../enum'
import { core } from '../share'
import { useAppStore } from '../store'
import ChantTenantPicker from './chant-tenant-picker/index.vue'

type Form = {
  sysCode?: string
  tenantId?: string
  tenantName?: string
}
// props
const props = defineProps<{
  alterTenant?: boolean // 是否可以修改租户
  apiUrl?: string
  clearable?: boolean
  modelValue?: Form
  readonly?: boolean
  sysDisabled?: boolean // 禁用系统类型选择
  tenantTips?: string
  tenantClassify?: TenantClassify
  type?: 'form' | 'normal' | 'search'
}>()
// store
const appStore = useAppStore()
// i18n
const { t } = useI18n({
  messages: {
    en: {
      sysCode: 'system type',
      ...lang.en
    },
    zh: {
      sysCode: '系统类型',
      ...lang.zh
    }
  }
})
const { t: tg } = useI18n({ useScope: 'global' })
// emit
const emit = defineEmits(['update:modelValue', 'change'])
// var
const sysCodeEnum = appStore.dict.SysCodeEnum
// state
const state = reactive({
  form: props.modelValue as Form
})
// watch
watch(
  () => props.modelValue,
  () => {
    state.form = props.modelValue as Form
  }
)
// 是否为psa
const isPsa = core.isPsa()
// computed
const tenantText = computed(() => {
  const map = {
    agentTenant: 'agentTenant', // 人工外呼租户
    aiTenant: 'aiTenant', // 智能语音租户
    entrust: 'entrust', // 资产方
    masterWorkPlace: 'masterWorkPlace', // 集团职场
    masterSingleWorkPlace: 'masterSingleWorkPlace', // 所属职场
    organization: 'organization', // 组织
    supplier: 'supplier', // 供应商
    tenant: 'tenant', // 租户
    workplace: 'workplace', // 职场
    workplaceTemplate: 'workplaceTemplate' // 职场模板
  } as any
  // 租户分类
  const tenantClassify = props.tenantClassify || TenantClassify.Tenant
  const label = map[tenantClassify]
  return t(label)
})
// 显示租户picker
function showTenantPicker() {
  if (isPsa) {
    // psa必须系统类型为平台才显示
    return state.form.sysCode === '11'
  } else {
    // pta必须有tenantClassify才显示
    return !!props.tenantClassify
  }
}
// 系统类型change
function onSysChange(val: string) {
  state.form.sysCode = val
  state.form.tenantId = ''
  state.form.tenantName = ''
  emit('update:modelValue', state.form)
  emit('change', state.form)
}
// 租户回调
function onTenant(row: any) {
  state.form.tenantId = row.id
  state.form.tenantName = row.tenantName
  emit('update:modelValue', state.form)
  emit('change', state.form)
}
</script>

<style scoped lang="scss"></style>
