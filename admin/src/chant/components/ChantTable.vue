<template>
  <el-table
    v-loading="vModel.loading"
    :border="true"
    class="chant-table"
    :data="vModel.list"
    :height="state.height || undefined"
    ref="tableRef"
    :row-key="props.rowKey"
    @row-click="onRowClick"
    @selection-change="onSelectChange">
    <!-- 复选框 -->
    <el-table-column
      v-if="props.showSelection"
      align="center"
      fixed="left"
      :selectable="selectable"
      type="selection"
      width="35" />
    <el-table-column
      v-for="item in columnsList"
      v-bind="item"
      :align="'center'"
      :fixed="item.fixed"
      :key="item.prop"
      :min-width="item.width || columnWidth || 144"
      show-overflow-tooltip
      sortable>
      <template #header>
        <span>{{ translate(item) }}</span>
      </template>
      <template #="{ row, $index }">
        <div class="content-box">
          <!-- slot -->
          <slot
            v-if="item.slot"
            :index="$index"
            :item="item"
            :name="item.prop"
            :row="row"
            :value="row[item.prop]">
          </slot>
          <!-- 可编辑 -->
          <template v-else-if="item.editable">
            <!-- input -->
            <el-input
              v-if="!item.type"
              v-model="row[item.prop]"
              :placeholder="translate(item)">
            </el-input>
            <!-- select -->
            <el-select
              v-else-if="item.type === FormTypeEnum.Select"
              v-model="row[item.prop]"
              :placeholder="translate(item)">
              <el-option
                v-for="(val, key) in props.dict?.[item.prop]"
                :key="key"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
            <!-- input-number -->
            <el-input-number
              v-else-if="item.type === FormTypeEnum.InputNumber"
              v-model="row[item.prop]"
              controls-position="right"
              :placeholder="translate(item)">
            </el-input-number>
          </template>
          <!-- dict -->
          <div v-else-if="item.type === FormTypeEnum.Select">
            <el-tag
              :effect="item.tagType ? 'dark' : 'plain'"
              :type="item.tagType?.[row[item.prop]]">
              {{ dictFmt(item.prop, row[item.prop]) }}
            </el-tag>
          </div>
          <!-- date -->
          <div v-else-if="isDateFmt(item)">
            {{ format.date(row[item.prop]) || '-' }}
          </div>
          <!-- datetime -->
          <div v-else-if="isDatetimeFmt(item)">
            {{ format.datetime(row[item.prop]) || '-' }}
          </div>
          <!-- 金额 -->
          <div v-else-if="item.format === FormatEnum.Money">
            {{ format.money(row[item.prop]) || '-' }}
          </div>
          <!-- value -->
          <el-text v-else truncated>
            {{ row[item.prop] || '-' }}
            <template v-if="item.append">
              {{ tg(item.append) }}
            </template>
          </el-text>
          <!-- copy -->
          <el-icon
            v-if="item.copy && row[item.prop]"
            class="table-icon-copy"
            @click.stop="onCopy(row[item.prop])">
            <DocumentCopy />
          </el-icon>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {
  computed,
  nextTick,
  onActivated,
  onMounted,
  reactive,
  ref,
  watch,
  type InputHTMLAttributes
} from 'vue'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
import { DocumentCopy } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
// @ts-ignore
import Sortable from 'sortablejs'
import {
  FormatEnum,
  FormTypeEnum,
  type Dict,
  type ListColumn as Column,
  type ListState
} from '@/chant'
import { vuei18n } from '@/plugs'
import { base, format } from '@/utils'

// defineExpose
defineExpose({
  scrollToBottom // 滚动到底部
})
// type
interface Props {
  columnWidth?: number // 列宽度
  dict?: Dict // 字典
  heightWild?: boolean // 高度不限制
  lang?: any // 国际化
  modelValue: ListState // modelValue
  rowKey?: string // 行数据的key
  showSelection?: boolean // 显示勾选框
  sort?: boolean // 行是否可以拖动
}
// props
const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  showSelection: true
})
// emits
const emits = defineEmits(['instance', 'row-click', 'update:modelValue'])
// use
const { toClipboard } = useClipboard()
const { t: tg } = useI18n({ useScope: 'global' })
const vModel = useVModel(props, 'modelValue', emits)
// ref
const tableRef = ref()
// state
const state = reactive({
  height: 0
})
// resize
window.addEventListener('resize', () => {
  // 列表容器自适应
  tableAdapter()
})
// computed
const columnsList = computed(() => {
  return vModel.value.columns?.filter((item) => {
    if (item.onlySearch) {
      return false
    }
    if (item.hide) {
      return false
    }
    return true
  })
})
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = props.lang
  return lang ? lang[locale] : {}
})
// watch
watch(
  () => vModel.value.allFlag,
  () => {
    // 全选按钮禁用状态
    allCheckedStatus()
  }
)
// 初始化
onMounted(() => {
  // 实例更新
  emits('instance', tableRef.value)
  // 列表容器自适应
  tableAdapter()
  // 拖拽
  sortCreate()
})
// 组件激活时
onActivated(() => {
  // 列表容器自适应
  tableAdapter()
  // 拖拽
  sortCreate()
})
// 全选按钮禁用状态
function allCheckedStatus() {
  const tablEl = tableRef.value?.$el as HTMLElement
  const labelEl = tablEl.querySelector('.el-table__header-wrapper .el-checkbox')
  const spanEl = labelEl?.querySelector('.el-checkbox__input')
  const inputEl = spanEl?.querySelector(
    '.el-checkbox__original'
  ) as InputHTMLAttributes
  if (vModel.value.allFlag === 1) {
    labelEl?.classList.add('is-disabled')
    spanEl?.classList.add('is-disabled')
  } else {
    labelEl?.classList.remove('is-disabled')
    spanEl?.classList.remove('is-disabled')
  }
  inputEl.disabled = !!vModel.value.allFlag
}
// 拖拽
function sortCreate() {
  const list = vModel.value.list
  if (!props.sort || !list?.length) {
    return
  }
  const el = tableRef.value?.$el.querySelector('.el-table__body > tbody')
  Sortable.create(el, {
    onEnd: (event: any) => {
      const data = base.clone(list)
      const item = data?.splice(event.oldIndex, 1)[0]
      data?.splice(event.newIndex, 0, item)
      data?.forEach((item, index) => {
        item.serialNo = index + 1
      })
      vModel.value.list = data as any[]
      emits('update:modelValue', vModel.value)
    }
  })
}
// 滚动到底部
function scrollToBottom() {
  const el = tableRef.value?.$el as HTMLElement
  setTimeout(() => {
    const bodyEl = el.querySelector('.el-table__body')
    tableRef.value?.setScrollTop(bodyEl?.clientHeight)
  }, 0)
}
// 列表容器自适应
function tableAdapter() {
  if (props.heightWild) {
    return
  }
  nextTick(() => {
    const el = tableRef.value?.$el as HTMLElement
    state.height = el?.offsetHeight
  })
}
// 是否date格式化
function isDateFmt(column: Column) {
  if (column.type) {
    return [FormTypeEnum.Date, FormTypeEnum.DateRange].includes(column.type)
  }
  return false
}
// 是否datetime格式化
function isDatetimeFmt(column: Column) {
  if (column.type) {
    return [FormTypeEnum.Datetime, FormTypeEnum.DatetimeRange].includes(
      column.type
    )
  }
  return false
}
// 字典格式化
function dictFmt(prop: string, value: any) {
  return props.dict?.[prop]?.[value] || '-'
}
// CheckBox是否可勾选
function selectable() {
  return vModel.value.allFlag === 0
}
// 选择项发生变化时
function onSelectChange(selection: any[]) {
  vModel.value.selection = selection
}
// 单元格点击
function onRowClick(row: any) {
  emits('row-click', row)
}
// 复制
async function onCopy(text: string) {
  try {
    await toClipboard(text)
    ElMessage.success(tg('tips.copySuccess'))
  } catch (e) {
    console.error(e)
    ElMessage.error(tg('tips.copyFail'))
  }
}
// 翻译
function translate(column: Column) {
  let label = column.label || column.prop
  var pattern = new RegExp('[\u4E00-\u9FA5]+')
  if (pattern.test(label)) {
    return label
  }
  if (label.indexOf('.') >= 0) {
    return tg(label)
  }
  return messages.value[label]
}
</script>

<style scoped lang="scss">
.chant-table {
  flex: 1;
  overflow: hidden;
  :deep(.link) {
    color: var(--main-color);
    cursor: pointer;
    overflow: hidden;
    text-decoration: underline;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :deep(.el-button.is-link) {
    font-weight: normal;
  }
  :deep(.el-button + .el-button) {
    margin-left: 3px;
  }
  .content-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .table-icon-copy {
    color: var(--main-color);
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
