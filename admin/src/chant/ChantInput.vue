<template>
  <el-input
    v-model="vModel"
    v-bind="$attrs"
    :clearable="clearable"
    :placeholder="placeholder"
    @input="onInput">
    <template v-if="slots.append" #append>
      <slot name="append"></slot>
    </template>
    <template v-if="slots.prepend" #prepend>
      <slot name="prepend"></slot>
    </template>
  </el-input>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useVModel } from '@vueuse/core'
import { base } from '@/utils'

interface Props {
  max?: number
  min?: number
  modelValue: any
  clearable?: boolean
  placeholder?: string
  textType?: 'string' | 'number' | 'float' | 'phone-key'
  tip?: boolean
}
// props
const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  textType: 'string',
  tip: true
})
// emit
const emit = defineEmits(['input', 'update:modelValue'])
// use
const vModel = useVModel(props, 'modelValue', emit)
const slots = useSlots()
// computed
const placeholder = computed(() => {
  if (props.tip) {
    return '请输入' + props.placeholder
  } else {
    return props.placeholder
  }
})
// input
function onInput(val: string) {
  if (base.isEmpty(val)) {
    vModel.value = val
    return
  }
  // 数值
  if (['number', 'float'].includes(props.textType)) {
    if (val === '-') {
      vModel.value = val
      return
    }
    const isPoint = val.substring(val.length - 1, val.length) === '.'
    if (props.textType === 'float' && isPoint) {
      vModel.value = val
      return
    }
    const regex = /-?\d+(\.\d+)?/g
    const matchs = val.match(regex)
    let num = Number(matchs?.[0] || 0)
    const min = Number(props.min)
    const max = Number(props.max)
    if (!base.isEmpty(props.min) && num < min) {
      // num = min
    } else if (!base.isEmpty(props.max) && num > max) {
      num = max
    }
    vModel.value = base.isEmpty(num) ? '' : num
  }
  // 电话按键
  if (props.textType === 'phone-key') {
    val = val?.replace(/[^\d*#]/g, '')
    vModel.value = val
  }
}
</script>
