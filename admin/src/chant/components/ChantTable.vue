<template>
  <el-table
    v-loading="vModel?.loading || false"
    :border="true"
    class="chant-table"
    :data="list"
    :height="state.height || undefined"
    ref="tableRef"
    :row-key="(row) => row[props.rowKey]"
    @selection-change="onSelectChange">
    <!-- 复选框 -->
    <el-table-column
      v-if="props.showSelection"
      align="center"
      fixed="left"
      :reserve-selection="props.reserveSelection"
      :selectable="selectable"
      type="selection"
      width="35" />
    <el-table-column
      v-for="item in availableColumns"
      :key="item.prop"
      align="center"
      :fixed="item.fixed"
      :label="translate(item)"
      :min-width="item.width || columnWidth || 144"
      show-overflow-tooltip
      sortable>
      <template #="{ row, $index }">
        <div class="content-box">
          <!-- prop slot -->
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
              v-else-if="item.type === 'select'"
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
              v-else-if="item.type === 'input-number'"
              v-model="row[item.prop]"
              controls-position="right"
              :placeholder="translate(item)">
            </el-input-number>
          </template>
          <!-- tag -->
          <el-tag
            v-else-if="item.type === 'select'"
            :effect="item.tagType ? 'dark' : 'plain'"
            :type="item.tagType?.[row[item.prop]]">
            {{ dictFmt(item.prop, row[item.prop]) }}
          </el-tag>
          <!-- text -->
          <el-text v-else truncated>
            {{ valueFmt(item, row[item.prop]) }}
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
    <!-- slot -->
    <slot></slot>
  </el-table>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
// @ts-ignore
import Sortable from 'sortablejs'
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
import type { Lang, ListColumn as Column, ListState } from '@/chant'
import { base, format } from '@/utils'

// defineExpose
defineExpose({
  scrollToBottom // 滚动到底部
})
// type
interface Props {
  columns?: Column[] // 列表字段
  columnWidth?: number // 列宽度
  dict?: any // 字典
  heightWild?: boolean // 高度不限制
  lang?: Lang // 国际化
  list?: any[] // 列表数据
  modelValue?: ListState // modelValue
  reserveSelection?: boolean // 数据刷新后是否保留选项
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
const emits = defineEmits(['instance', 'update:modelValue'])
// use
const { toClipboard } = useClipboard()
const { t: tg } = useI18n({ useScope: 'global' })
const { t } = useI18n({ messages: props?.lang })
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
const availableColumns = computed(() => {
  return columns.value?.filter((item) => {
    const hideInList = item.hideInPages?.includes('list')
    if (item.onlySearch || item.hide || hideInList) {
      return false
    }
    return true
  })
})
const columns = computed(() => {
  return vModel.value?.columns || props.columns
})
const list = computed(() => {
  return vModel.value?.list || props.list
})
// watch
watch(
  () => vModel.value?.allFlag,
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
  if (vModel.value?.allFlag === 1) {
    labelEl?.classList.add('is-disabled')
    spanEl?.classList.add('is-disabled')
  } else {
    labelEl?.classList.remove('is-disabled')
    spanEl?.classList.remove('is-disabled')
  }
  inputEl.disabled = !!vModel.value?.allFlag
}
// 拖拽
function sortCreate() {
  if (!props.sort || !list.value?.length) {
    return
  }
  const el = tableRef.value?.$el.querySelector('.el-table__body > tbody')
  Sortable.create(el, {
    onEnd: (event: any) => {
      const data = base.clone(list.value)
      const item = data?.splice(event.oldIndex, 1)[0]
      data?.splice(event.newIndex, 0, item)
      if (vModel.value) {
        vModel.value.list = data as any[]
        emits('update:modelValue', vModel.value)
      }
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
// value格式化
function valueFmt(column: Column, value: any) {
  if (!value) {
    return '-'
  }
  // date
  if (column.datepickerType) {
    const map = {
      date: 'YYYY-MM-DD',
      datetime: 'YYYY-MM-DD HH:mm:ss'
    } as any
    const template = map[column.datepickerType]
    return dayjs(value).format(template)
  }
  // money
  if (column.format === 'money') {
    return format.money(value)
  }
  // append
  const append = column.append ? tg(column.append) : ''
  return value + append
}
// 字典格式化
function dictFmt(prop: string, value: any) {
  return props.dict?.[prop]?.[value] || '-'
}
// CheckBox是否可勾选
function selectable() {
  return vModel.value?.allFlag === 0
}
// 选择项发生变化时
function onSelectChange(selection: any[]) {
  if (vModel.value) {
    vModel.value.selection = selection
  }
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
  return t(label)
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
