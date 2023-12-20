<template>
  <div class="toolbar m-t-5">
    <div class="all-box">
      <template v-if="props.showCheckedAll">
        <el-checkbox v-model="state.checked" class="all-box">
          <span>{{ t('all') }}:</span>
          <span class="p-l-5">{{ props.total }}{{ t('record') }}</span>
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
      <el-button-group class="m-l-10">
        <!-- 新增 -->
        <chant-icon-button
          v-if="show('add')"
          :content="t('add')"
          :icon="Plus"
          type="primary"
          @click="onEmit('add')">
        </chant-icon-button>
        <!-- 复制新增 -->
        <chant-icon-button
          v-if="show('copy-add')"
          :content="t('copyAdd')"
          :icon="CopyDocument"
          @click="onEmit('copy-add')">
        </chant-icon-button>
        <!-- 编辑 -->
        <chant-icon-button
          v-if="show('edit')"
          :content="t('edit')"
          :icon="Edit"
          @click="onEmit('edit')">
        </chant-icon-button>
        <!-- 删除 -->
        <chant-icon-button
          v-if="show('delete')"
          :content="t('delete')"
          :icon="Delete"
          type="danger"
          @click="onEmit('delete')">
        </chant-icon-button>
      </el-button-group>
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
import { useI18n } from 'vue-i18n'
import { CopyDocument, Delete, Edit, Plus } from '@element-plus/icons-vue'
import { base } from '@/utils'
import { type ListColumn as Column } from '@/type'
import FieldFilter from './FieldFilter.vue'

// props
const props = defineProps<{
  columns: Column[]
  messages?: any
  options?: string[]
  showCheckedAll?: boolean
  showFilter?: boolean // 显示字段过滤
  total: number
}>()
// emits
const emits = defineEmits(['emit', 'checked', 'column-change'])
// i18n
const { t } = useI18n({
  messages: {
    en: {
      all: 'all',
      record: 'records',
      add: 'add',
      copyAdd: 'copy add',
      edit: 'edit',
      delete: 'delete',
      filter: 'filter'
    },
    zh: {
      all: '全部',
      record: '条记录',
      add: '新增',
      copyAdd: '复制新增',
      edit: '编辑',
      delete: '删除',
      filter: '过滤'
    }
  }
})
// state
const state = reactive({
  columns: base.clone(props.columns),
  checked: false
})
// watch
watch(
  () => state.checked,
  () => {
    emits('checked', state.checked)
  }
)
// column change
function onColumnChange(columns: Column[]) {
  emits('column-change', columns)
}
// emit
function onEmit(type: string) {
  emits('emit', type)
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
  .all-box {
    font-size: 12px;
    font-weight: normal;
    padding-left: 1px;
  }
}
</style>
