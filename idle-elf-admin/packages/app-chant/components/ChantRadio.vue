<template>
  <el-radio-group v-model="state.model" v-bind="$attrs" @change="onChange">
    <el-radio v-for="(val, key) in data" :key="key" :label="key">
      {{ val }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

interface Props {
  data: any
  modelValue: any
}
// props
const props = withDefaults(defineProps<Props>(), {})
// emit
const emit = defineEmits(['change', 'update:modelValue'])
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
// change
function onChange() {
  emit('update:modelValue', state.model)
  emit('change', state.model)
}
</script>
