<template>
  <div class="chant-tab">
    <div
      v-for="(item, index) in children"
      class="item"
      :class="{ active: isChecked(index, item?.props?.name) }"
      @click="onTab(index, item?.props?.name)">
      {{ item?.props?.label }}
      <div v-show="isChecked(index, item?.props?.name)" class="adorn"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, useSlots, watch } from 'vue'

interface Props {
  modelValue?: number | string
  data?: string[]
}
// props
const props = withDefaults(defineProps<Props>(), {
  modelValue: 0
})
// emit
const emit = defineEmits(['tab', 'update:modelValue'])
// slots
const slots = useSlots()
// @ts-ignore
const children = slots.default()[0].children as any
// state
const state = reactive({
  active: props.modelValue
})
// watch
watch(
  () => props.modelValue,
  () => {
    state.active = props.modelValue
  }
)
// tab
function onTab(index: number, name?: any) {
  state.active = name ?? index
  emit('update:modelValue', state.active)
  emit('tab', state.active)
}
// 是否选中
function isChecked(index: number, name: any) {
  return [index, name].includes(state.active)
}
</script>

<style scoped lang="scss">
@import '../../style/var.scss';

.chant-tab {
  background-color: $color-gray;
  color: $color-black;
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 12px;
  margin-bottom: 5px;
  padding: 0 10px;
  .item {
    cursor: pointer;
    position: relative;
    padding: 10px 0;
    &.active {
      color: $color-base;
    }
    .adorn {
      background-color: $color-base;
      height: 1px;
      position: absolute;
      bottom: 5px;
      width: 100%;
    }
  }
  .item + .item {
    margin-left: 15px;
  }
}
</style>
