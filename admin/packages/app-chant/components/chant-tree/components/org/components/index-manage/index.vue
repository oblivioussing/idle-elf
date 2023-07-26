<template>
  <div class="w-100">
    <el-divider content-position="left">{{ t('title') }}</el-divider>
    <chant-table v-model="state" :show-selection="false" height-wild>
      <!-- 首页 -->
      <template #indexCode="{ row }">
        <chant-select
          v-model="row.indexCode"
          :data="dictFmt(row.sysKey)"
          :placeholder="t('index')"
          @change="onChange">
        </chant-select>
      </template>
    </chant-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { base, useLister } from '@chant'
import { columns, lang } from './share'

// props
const props = defineProps<{
  modelValue?: any[]
  dict: any
}>()
// emit
const emit = defineEmits(['update:modelValue'])
// use
const lister = useLister()
// i18n
const { t } = useI18n({
  messages: {
    en: {
      title: 'index manage',
      index: 'index'
    },
    zh: {
      title: '首页管理',
      index: '首页'
    }
  }
})
// state
const state = reactive({
  ...lister.state,
  columns,
  lang,
  list: [
    { sysKey: 'aimi', indexCode: '' },
    { sysKey: 'wx', indexCode: '' }
  ]
})
// init
if (props.modelValue?.length) {
  state.list = base.clone(props.modelValue)
}
// watch
watch(
  () => props.modelValue,
  () => {
    if (props.modelValue?.length) {
      state.list = base.clone(props.modelValue)
    }
  }
)
// 字典
function dictFmt(type: 'aimi' | 'wx') {
  if (type === 'aimi') {
    return props.dict.SysIndexAimiDict
  }
  if (type === 'wx') {
    return props.dict.SysIndexWxDict
  }
}
// change
function onChange() {
  emit('update:modelValue', state.list)
}
</script>

<style scoped lang="scss"></style>
