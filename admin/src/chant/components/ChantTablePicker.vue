<template>
  <chant-dialog
    v-model="vModel"
    append-to-body
    class="chant-table-picker"
    :title="props.title"
    :width="props.width || '70%'">
    <div class="column-box">
      <div class="column-item">
        <!-- search -->
        <chant-table-search
          v-model="state"
          :dict="props.dict"
          :lang="props.lang"
          @query="getList"
          @refresh="lister.refresh(getList, state)">
        </chant-table-search>
        <!-- table -->
        <chant-table
          v-model="state"
          class="picker-table"
          :dict="props.dict"
          :lang="props.lang"
          :show-selection="false"
          @row-click="onRowClick">
        </chant-table>
        <!-- pagination -->
        <chant-pagination
          v-model="state.pages"
          :total="state.total"
          @change="getList">
        </chant-pagination>
      </div>
    </div>
  </chant-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useVModel } from '@vueuse/core'
import { type ListColumn } from '@/chant'
import { useLister } from '@/use'

// props
const props = defineProps<{
  columns: ListColumn[]
  dict?: any
  lang?: any
  modelValue: boolean
  title: string
  width?: string | number
}>()
// emits
const emits = defineEmits(['change', 'update:modelValue'])
// use
const vModel = useVModel(props, 'modelValue', emits)
// use
const lister = useLister()
// state
const state = reactive({
  ...lister.state,
  columns: createColumns()
})
// 获取列表
function getList() {
  // lister.getData('xx/xxx', state)
}
// 生成columns
function createColumns() {
  const index = props.columns?.findIndex((item) => item.prop === 'operate')
  index > -1 && props.columns?.splice(index, 1)
  return props.columns
}
// 行点击
function onRowClick(row: any) {
  emits('change', row)
  vModel.value = false
}
</script>

<style lang="scss">
.chant-table-picker {
  height: 84vh;
  .el-dialog__body {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 0 15px;
  }
  .column-box {
    flex: 1;
    .column-item {
      flex: 1;
      overflow: hidden !important;
    }
  }
  .picker-table {
    cursor: pointer;
  }
}
</style>
