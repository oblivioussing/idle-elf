<template>
  <div class="toolbar chant-table-operation">
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
      <!-- 批量修改 -->
      <el-dropdown v-if="show('edit')">
        <el-button type="primary">
          {{ t('batch') + tg('button.alter') }}
          <el-icon><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item>Action 4</el-dropdown-item>
            <el-dropdown-item>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- button -->
      <div :class="{ 'm-l-10': props.options?.length }">
        <el-button-group>
          <!-- 新增 -->
          <chant-icon-button
            v-if="show('add')"
            :content="tg('button.add')"
            icon-type="plus"
            type="primary"
            @click="onEmit('add')">
          </chant-icon-button>
          <!-- 批量删除 -->
          <chant-icon-button
            v-if="show('delete')"
            :content="t('batch') + tg('button.delete')"
            icon-type="delete"
            type="danger"
            @click="onEmit('delete')">
          </chant-icon-button>
        </el-button-group>
      </div>
      <!-- 字段筛选 -->
      <field-filter
        v-if="vModel.columns && props.showFilter"
        v-model="vModel"
        :lang="props.lang">
      </field-filter>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import { type ListState } from '@/chant'
import FieldFilter from './components/FieldFilter.vue'

type Option = 'add' | 'edit' | 'delete'
// type
interface Props {
  lang?: any // 国际化
  options?: Option[]
  modelValue: ListState
  showCheckedAll?: boolean
  showFilter?: boolean
}
// props
const props = withDefaults(defineProps<Props>(), {
  showFilter: true
})
// emits
const emits = defineEmits(['add', 'edit', 'delete', 'update:modelValue'])
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
// onMounted
onMounted(() => {
  buttonGroup() // 按钮组
})
// init
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
  }, 100)
}
// emit
function onEmit(type: Option) {
  emits(type)
}
// 显示按钮
function show(type: Option) {
  return props.options?.includes(type)
}
// checkbox change
function onChange(val: any) {
  vModel.value.allFlag = val ? 1 : 0
}
</script>

<style scoped lang="scss">
.chant-table-operation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  .all-box {
    font-size: 12px;
    font-weight: normal;
    padding-left: 1px;
  }
  :deep(.el-button) {
    height: 28px;
  }
  :deep(.el-button:focus) {
    outline: 0;
    outline-offset: 0;
  }
}
</style>
