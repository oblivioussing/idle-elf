<template>
  <div class="toolbar m-t-5">
    <div class="all-box">
      <el-checkbox
        v-if="props.showCheckedAll"
        class="all-box"
        @change="onChange">
        <span>{{ t('all') }}:</span>
        <span class="p-l-5">{{ vModel.total }}{{ t('record') }}</span>
      </el-checkbox>
    </div>
    <div class="flex-align-center" ref="groupsRef">
      <el-button-group>
        <slot></slot>
      </el-button-group>
      <!-- button -->
      <el-button-group class="m-l-10">
        <!-- 新增 -->
        <chant-button
          v-if="show('add')"
          :content="tg('button.add')"
          :icon="Plus"
          type="primary"
          @click="onEmit('add')">
        </chant-button>
        <!-- 编辑 -->
        <chant-button
          v-if="show('edit')"
          :content="t('batch') + tg('button.edit')"
          :disabled="vModel.selectionList.length === 0"
          :icon="Edit"
          @click="onEmit('edit')">
        </chant-button>
        <!-- 删除 -->
        <chant-button
          v-if="show('delete')"
          :content="t('batch') + tg('button.delete')"
          :disabled="vModel.selectionList.length === 0"
          :icon="Delete"
          type="danger"
          @click="onEmit('delete')">
        </chant-button>
      </el-button-group>
      <!-- 字段筛选 -->
      <field-filter v-if="vModel.columns && props.showFilter" v-model="vModel">
      </field-filter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import { type ListState } from '@/type'
import FieldFilter from './FieldFilter.vue'

// props
const props = defineProps<{
  options?: string[]
  modelValue: ListState
  showCheckedAll?: boolean
  showFilter?: boolean
}>()
// emits
const emits = defineEmits(['emit', 'update:modelValue'])
// use
const { t: tg } = useI18n({ useScope: 'global' })
const { t } = useI18n({
  messages: {
    en: {
      all: 'all',
      batch: 'batch',
      record: 'records'
    },
    zh: {
      all: '全部',
      batch: '批量',
      record: '条记录'
    }
  }
})
const vModel = useVModel(props, 'modelValue', emits)
// ref
const groupsRef = ref()
// init
buttonGroup() // 按钮组
// 按钮组
function buttonGroup() {
  setTimeout(() => {
    const groups = groupsRef.value.querySelectorAll(
      '.el-button-group'
    ) as NodeListOf<Element>
    groups.forEach((item) => {
      if (item.children.length === 1) {
        item.removeAttribute('class')
      }
    })
  }, 600)
}
// emit
function onEmit(type: string) {
  emits('emit', type)
}
// 显示按钮
function show(type: string) {
  return props.options?.includes(type)
}
// checkbox change
function onChange(val: any) {
  vModel.value.allFlag = val ? 1 : 0
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
