<template>
  <div class="toolbar">
    <el-pagination
      background
      :current-page="state.pageNum"
      :layout="props.layout"
      :pager-count="props.pagerCount"
      :page-size="state.pageSize"
      :page-sizes="[10, 20, 50]"
      small
      :total="props.total"
      @current-change="onCurrent"
      @size-change="onSize">
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

type Pages = {
  pageNum: number
  pageSize: number
}
interface Props {
  modelValue?: Pages
  layout?: string
  total: number
  pagerCount?: number
}
// props
const props = withDefaults(defineProps<Props>(), {
  layout: 'total, sizes, prev, pager, next, jumper',
  pagerCount: 7
})
// emit
const emit = defineEmits(['update:modelValue', 'change'])
// state
const state = reactive({ ...props.modelValue })
// page改变时
function onCurrent(page: number) {
  state.pageNum = page
  emit('update:modelValue', state)
  emit('change')
}
// size改变时
function onSize(size: number) {
  state.pageSize = size
  emit('update:modelValue', state)
  emit('change')
}
</script>

<style scoped lang="scss">
.toolbar {
  margin-top: 5px;
  padding: 8px 5px;
  .el-pagination {
    justify-content: center;
  }
}
</style>
