<template>
  <div class="toolbar m-t-5">
    <div class="all-box">
      <template v-if="props.showCheckedAll">
        <el-checkbox v-model="state.checked" class="all-box">
          <span>全部:</span>
          <span class="p-l-5">{{ props.total }}条记录</span>
        </el-checkbox>
      </template>
    </div>
    <div class="flex-align-center">
      <!-- slot -->
      <slot name="alone"></slot>
      <el-button-group>
        <slot></slot>
      </el-button-group>
      <!-- button -->
      <chant-button-group :count="options?.length || 0" class="m-l-10">
        <!-- 新增 -->
        <chant-icon-button
          v-if="show('add')"
          content="新增"
          :icon="Plus"
          :tip-disabled="state.tooltipDisable"
          type="primary"
          @click="onEmit('add')">
        </chant-icon-button>
        <!-- 复制新增 -->
        <chant-icon-button
          v-if="show('copy-add')"
          content="复制新增"
          :icon="CopyDocument"
          :tip-disabled="state.tooltipDisable"
          type="primary"
          @click="onEmit('copy-add')">
        </chant-icon-button>
        <!-- 编辑 -->
        <chant-icon-button
          v-if="show('edit')"
          content="编辑"
          :icon="Edit"
          :tip-disabled="state.tooltipDisable"
          type="primary"
          @click="onEmit('edit')">
        </chant-icon-button>
        <!-- 删除 -->
        <chant-icon-button
          v-if="show('delete')"
          content="删除"
          icon-type="delete"
          type="danger"
          @click="onEmit('delete')">
        </chant-icon-button>
        <!-- 导出 -->
        <chant-icon-button
          v-if="show('export')"
          content="导出"
          icon-type="download"
          @click="onEmit('export')">
        </chant-icon-button>
        <!-- 作废 -->
        <chant-icon-button
          v-if="show('void')"
          content="作废"
          iconfont="icon-move"
          type="danger"
          @click="onEmit('void')">
        </chant-icon-button>
      </chant-button-group>
      <!-- 字段筛选 -->
      <field-filter
        v-if="props.columns.length && props.showFilter"
        v-model="props.columns"
        :messages="props.messages"
        @column-change="onColumnChange">
      </field-filter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { CopyDocument, Edit, Plus } from '@element-plus/icons-vue'
import { base } from '@/utils'
import { type ListColumn as Column } from '@/type'
import FieldFilter from './FieldFilter.vue'
import ChantButtonGroup from '../../ChantButtonGroup.vue'

// props
const props = defineProps<{
  columns: Column[]
  messages?: any
  options?: string[]
  showCheckedAll?: boolean
  showFilter?: boolean // 显示字段过滤
  total: number
}>()
// emit
const emit = defineEmits(['emit', 'checked', 'column-change'])
// state
const state = reactive({
  columns: base.clone(props.columns),
  checked: false,
  tooltipDisable: false
})
// watch
watch(
  () => state.checked,
  () => {
    emit('checked', state.checked)
  }
)
// column change
function onColumnChange(columns: Column[]) {
  emit('column-change', columns)
}
// emit
function onEmit(type: string) {
  if (['add', 'copy-add', 'edit'].includes(type)) {
    state.tooltipDisable = true
    setTimeout(() => {
      state.tooltipDisable = false
    }, 1000)
  }
  emit('emit', type)
}
// 显示按钮
function show(type: string) {
  return props.options?.includes(type)
}
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px;
  .all-box {
    font-size: 12px;
    font-weight: normal;
    padding-left: 1px;
  }
}
</style>
