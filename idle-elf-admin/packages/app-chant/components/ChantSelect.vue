<template>
  <el-select
    v-model="state.model"
    v-bind="$attrs"
    :clearable="props.clearable"
    :multiple="props.multiple"
    :collapse-tags="props.collapseTags"
    :placeholder="placeholder"
    @change="onChange">
    <el-option
      v-for="(item, index) in dataCpd"
      :key="index"
      :label="item[props.label]"
      :value="item[props.value]">
      <template v-if="props.both || props.extraLabel">
        <span class="dropdown-left">{{ item[props.label] }}</span>
        <span class="dropdown-right">
          {{ props.extraContent }}{{ item[props.extraLabel || props.value] }}
        </span>
      </template>
    </el-option>
  </el-select>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  both?: boolean // option显示两个值
  clearable?: boolean
  data?: Record<string, any> | any[]
  extraLabel?: string // option额外显示的字段
  extraContent?: string // option额外显示的文案
  label?: string
  modelValue: any
  multiple?: boolean
  collapseTags?: boolean // 多选时是否将选中值按文字的形式展示
  placeholder?: string
  tip?: boolean
  value?: string
}
// props
const props = withDefaults(defineProps<Props>(), {
  label: 'label',
  tip: true,
  value: 'value'
})
// emit
const emit = defineEmits(['clear', 'change', 'update:modelValue'])
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// reactive
const state = reactive({
  model: props.modelValue
})
// watch
watch(
  () => props.modelValue,
  () => {
    state.model = props.modelValue
  }
)
// computed
const placeholder = computed(() => {
  if (props.tip) {
    return tg('tips.select') + props.placeholder
  } else {
    return props.placeholder
  }
})
const dataCpd = computed(() => {
  if (Array.isArray(props.data)) {
    return props.data
  } else {
    let list = []
    for (let item in props.data) {
      const label = props.data[item]
      const value = item
      list.push({ label, value })
    }
    return list
  }
})
// change
function onChange() {
  emit('update:modelValue', state.model)
  emit('change', state.model)
}
</script>
