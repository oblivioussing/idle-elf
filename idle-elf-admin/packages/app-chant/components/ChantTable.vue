<template>
  <el-table
    ref="tableRef"
    v-loading="props?.modelValue?.loading"
    v-bind="$attrs"
    :border="true"
    :height="state.height ? state.height : undefined"
    :highlight-current-row="props.highlightCurrentRow"
    :data="props.list || props?.modelValue?.list"
    :row-key="props.rowKey || 'id'"
    :show-summary="props?.showSummary"
    :summary-method="props?.summaryMethod"
    :span-method="props?.objectSpanMethod"
    :empty-text="props?.emptyText"
    class="chant-table"
    @select="onSelect"
    @select-all="onSelectAll"
    @selection-change="onSelectionChange"
    @row-click="onRowClick"
    @row-dblclick="onRowDbClick"
    @sort-change="onSortChange">
    <!-- 复选框 -->
    <el-table-column
      v-if="props.showSelection"
      align="center"
      type="selection"
      :selectable="selectable"
      fixed="left"
      width="35" />
    <!-- 索引 -->
    <el-table-column
      v-if="props.showIndex"
      type="index"
      align="center"
      width="35" />
    <!-- custom columns -->
    <template v-if="slots.columns">
      <slot name="columns"></slot>
    </template>
    <!-- column -->
    <template v-else>
      <template v-for="item in props.columns || props?.modelValue?.columns">
        <el-table-column
          v-if="!item.hide && !item.onlySearch"
          v-bind="item"
          :min-width="item.width || columnWidth || 140"
          :align="item.align || 'center'"
          :fixed="item.fixed"
          :sortable="props.sortable"
          :show-overflow-tooltip="state.showOverflowTooltip">
          <template #header>
            <span>{{ translate(item) }}</span>
          </template>
          <template #="scope">
            <div class="flex-center">
              <!-- slot -->
              <slot
                v-if="item.slot"
                :row="scope.row"
                :name="item.prop"
                :value="scope.row[item.prop]"
                :index="scope.$index"
                :label="translate(item)">
              </slot>
              <!-- 格式化 -->
              <template v-else-if="item.format">
                <!-- dict -->
                <el-tag
                  v-if="item.format === FormatEnum.Dict"
                  :class="tagType(scope.row[item.prop], item.tagColor)">
                  {{ dictFmt(item.prop, scope.row[item.prop]) || '-' }}
                </el-tag>
                <!-- dict-list -->
                <template v-else-if="item.format === FormatEnum.DictList">
                  <el-tag
                    v-for="child in scope.row[item.prop]"
                    :class="tagType(child)"
                    class="m-l-5">
                    {{ dictFmt(item.prop, child) || '-' }}
                  </el-tag>
                </template>
                <!-- date -->
                <div v-else-if="item.format === FormatEnum.Date">
                  {{ format.date(scope.row[item.prop]) || '-' }}
                </div>
                <!-- datetime -->
                <div v-else-if="item.format === FormatEnum.Datetime">
                  {{ format.dateTime(scope.row[item.prop]) || '-' }}
                </div>
                <!-- 金额 -->
                <div v-else-if="item.format === FormatEnum.Money">
                  {{ format.money(scope.row[item.prop]) || '-' }}
                </div>
              </template>
              <!-- link -->
              <div
                v-else-if="item.link"
                :class="{ link: item.link }"
                @click.stop="onLink(item, scope.row)">
                {{ scope.row[item.prop] || '-' }}
              </div>
              <!-- value -->
              <div v-else class="ellipsis-1">
                {{
                  base.isEmpty(scope.row[item.prop])
                    ? '-'
                    : scope.row[item.prop]
                }}
              </div>
              <!-- copy -->
              <el-icon
                v-if="item.copy && scope.row[item.prop]"
                class="table-icon-copy"
                @click.stop="onCopy(scope.row[item.prop])">
                <DocumentCopy />
              </el-icon>
            </div>
          </template>
        </el-table-column>
      </template>
    </template>
  </el-table>
</template>

<script setup lang="ts">
import {
  computed,
  InputHTMLAttributes,
  nextTick,
  onActivated,
  onMounted,
  reactive,
  ref,
  useSlots,
  watch
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
import { ElMessage, ElTable } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'
// @ts-ignore
import Sortable from 'sortablejs'
import useEventListener from '../use/event-listener'
import { Format as FormatEnum } from '../enum'
import { vuei18n } from '../plugs'
import { ListColumn as Column, ListState } from '../type'
import { base, format } from '../share'
import { useLister } from '../use'

interface Props {
  columnWidth?: number // 列宽度
  dbEdit?: boolean // 是否双击编辑
  detailParams?: Record<string, any> // 跳转详情页面额外参数
  linkData?: any[] // 链接数据
  modelValue?: ListState // modelValue
  lang?: Record<string, any> // 国际化
  list?: any // 列表数据
  columns?: Column[] // 列表字段
  defaultSelectionList?: string[] // 默认选中列表
  heightWild?: boolean // 高度不限制
  highlightCurrentRow?: boolean // 高亮当前选中行
  rowKey?: string // 行数据的key
  picker?: boolean // 是否为选择器
  rowSelection?: boolean // 行点击选中
  showIndex?: boolean // 显示索引
  showSelection?: boolean // 显示勾选框
  showSummary?: boolean // 显示合计
  sort?: boolean // 行是否可以拖动
  sortable?: boolean | 'custom' // 列是否可以排序
  summaryMethod?: any // 汇总法
  objectSpanMethod?: any // 合并行或列的计算方法
  emptyText?: string // 空数据时显示的文本内容
}
// props
const props = withDefaults(defineProps<Props>(), {
  dbEdit: true,
  rowSelection: true,
  showSelection: true,
  sortable: true
})
// emit
const emit = defineEmits([
  'update:modelValue',
  'row-click',
  'row-dblclick',
  'select',
  'select-all',
  'select-add',
  'select-remove',
  'sort-change',
  'sortable-end'
])
// defineExpose
defineExpose({
  tableAdapter, // 容器自适应
  scrollToBottom // 滚动到底部
})
// use
const lister = useLister()
// router
const route = useRoute()
const router = useRouter()
// slot
const slots = useSlots()
// clip
const { toClipboard } = useClipboard()
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// ref
const tableRef = ref<InstanceType<typeof ElTable>>()
// state
const state = reactive({
  selection: props.modelValue?.selectionList || ([] as any[]),
  height: 0,
  showOverflowTooltip: true
})
// resize
useEventListener('resize', () => {
  // 列表容器自适应
  tableAdapter()
})
// computed
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = props?.modelValue?.lang || props.lang
  if (lang) {
    return lang[locale]
  } else {
    return {}
  }
})
// 初始化
onMounted(() => {
  // 列表容器自适应
  tableAdapter()
  // 拖拽
  sortCreate()
  // 默认选中的selection
  setDefaultSelection()
  // 设置行的光标
  setRowPointer()
})
// 组件激活时
onActivated(() => {
  // 列表容器自适应
  tableAdapter()
  // 拖拽
  sortCreate()
  // 设置行的光标
  setRowPointer()
})
// watch
watch(
  () => props?.modelValue?.allFlag,
  () => {
    const tablEl = (tableRef.value as any)?.$el as HTMLElement
    const labelEl = tablEl.querySelector(
      '.el-table__header-wrapper .el-checkbox'
    )
    const spanEl = labelEl?.querySelector('.el-checkbox__input')
    const inputEl = spanEl?.querySelector(
      '.el-checkbox__original'
    ) as InputHTMLAttributes
    if (props?.modelValue?.allFlag === 1) {
      labelEl?.classList.add('is-disabled')
      spanEl?.classList.add('is-disabled')
    } else {
      labelEl?.classList.remove('is-disabled')
      spanEl?.classList.remove('is-disabled')
    }
    inputEl.disabled = !!props?.modelValue?.allFlag
  }
)
watch(
  () => props?.modelValue?.list,
  () => {
    // 拖拽
    sortCreate()
    // 默认选中的selection
    setDefaultSelection()
    // 设置行的光标
    setRowPointer()
  },
  { deep: true }
)
// 默认选中的defaultSelectionList更新，默认选中的selection方法重新渲染
watch(
  () => props?.defaultSelectionList,
  () => {
    nextTick(() => {
      // 默认选中的selection
      setDefaultSelection()
    })
  },
  { deep: true }
)
// 设置行的光标
function setRowPointer() {
  if (!props.showSelection && !props.dbEdit && !props.picker) {
    return
  }
  // 不加延迟nodes有可能拿不到
  setTimeout(() => {
    const tablEl = (tableRef.value as any)?.$el as HTMLElement
    const nodes = tablEl?.querySelectorAll('.el-table__body .el-table__row')
    nodes?.forEach((item) => {
      item.classList.add('pointer')
    })
  }, 0)
}
// 拖拽
function sortCreate() {
  if (!props.sort || !props?.modelValue?.list?.length) {
    return
  }
  const el = tableRef.value?.$el.querySelector('.el-table__body > tbody')
  Sortable.create(el, {
    onEnd: (event: any) => {
      const data = base.clone(props?.modelValue?.list)
      const item = data?.splice(event.oldIndex, 1)[0]
      data?.splice(event.newIndex, 0, item)
      data?.forEach((item, key) => {
        item.serialNo = key + 1
      })
      const value = props.modelValue
      value!.list = data as any[]
      emit('update:modelValue', value)
      emit('sortable-end', value)
    }
  })
}
// 滚动到底部
function scrollToBottom() {
  const el = tableRef.value?.$el as HTMLElement
  const bodyEl = el.querySelector('.el-table__body')
  tableRef.value?.setScrollTop(bodyEl?.clientHeight)
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
// 字典格式化
function dictFmt(prop: string, value: any) {
  const dict = props.modelValue?.dict
  if (!dict![prop]) {
    return
  }
  return dict![prop][value]
}
// 默认选中的selection
function setDefaultSelection() {
  tableRef.value?.clearSelection()
  if (!props.defaultSelectionList?.length) {
    return
  }
  const field = props.rowKey
  const rows = props.modelValue?.list?.filter((item) => {
    return props.defaultSelectionList?.find(
      (child) => child === item[field || 'id']
    )
  })
  if (rows?.length) {
    nextTick(() => {
      rows?.forEach((item) => {
        tableRef.value?.toggleRowSelection(item, true)
      })
    })
  }
}
// CheckBox是否可勾选
function selectable() {
  return !props?.modelValue?.allFlag
}
// tag类型
function tagType(val: string, colorMap?: Record<string, string>) {
  if (colorMap) {
    return colorMap[val]
  }
  const type: Record<string, string> = {
    0: 'color-0',
    1: 'color-1',
    2: 'color-2',
    3: 'color-3',
    4: 'color-4',
    5: 'color-5',
    6: 'color-6',
    7: 'color-7',
    8: 'color-8',
    9: 'color-9',
    10: 'color-0',
    11: 'color-1',
    12: 'color-2',
    13: 'color-3',
    14: 'color-4',
    15: 'color-5',
    16: 'color-6',
    17: 'color-7',
    18: 'color-8',
    19: 'color-9',
    99: 'color-99'
  }
  return type[val]
}
// 链接
function onLink(column: Column, row: any) {
  const path = column.linkUrl || route.path.replace('/index', '/detail')
  const query = lister.linkDataTrans(
    row,
    column.linkData,
    props?.modelValue?.tenant
  )
  const linkParams =
    typeof column.linkParams === 'function'
      ? column.linkParams(row)
      : column.linkParams
  Object.assign(query, props?.detailParams, linkParams || {})
  state.showOverflowTooltip = false
  router.push({ path, query })
  setTimeout(() => {
    state.showOverflowTooltip = true
  }, 1000)
}
// 手动勾选数据行
function onSelect(selection: any[], row: any) {
  const id = props.rowKey || 'id'
  const exit = selection.find((item) => item[id] === row[id])
  emit('select', { selection, row })
  if (exit) {
    emit('select-add', row)
  } else {
    emit('select-remove', row)
  }
}
// 手动勾选全选
function onSelectAll(selection: any[]) {
  emit('select-all', selection)
}
// 选择项发生变化
function onSelectionChange(selection: any[]) {
  const value = props.modelValue
  value!.selectionList = selection
  value!.selectionIdList = selection.map((item) => item.id)
  value!.selectionRow = selection[0]
  value!.selectionId = selection[0]?.id
  state.selection = selection
}
// 单元格点击
function onRowClick(row: any) {
  emit('row-click', row)
  // 如果高亮当前选中行,需要重新设置标光
  if (props.highlightCurrentRow) {
    // 设置行的光标
    setRowPointer()
  }
  if (!props.rowSelection) {
    return
  }
  if (props.showSelection) {
    const id = props.rowKey || 'id'
    const exit = state.selection.find((item) => item[id] === row[id])
    tableRef.value?.toggleRowSelection(row, !exit)
    emit('select', { selection: state.selection, row })
    if (exit) {
      emit('select-remove', row)
    } else {
      emit('select-add', row)
    }
  }
}
// 单元格双击
function onRowDbClick(row: any) {
  emit('row-dblclick', row)
  if (props.dbEdit && lister.permission('edit')) {
    const query = lister.linkDataTrans(
      row,
      props.linkData,
      props?.modelValue?.tenant
    )
    Object.assign(query, props?.modelValue?.jumpParams)
    lister.jump(query, '/edit')
  }
}
// 排序
function onSortChange(row: any) {
  if (props.modelValue) {
    const value = props.modelValue
    value!.query.sortColumn = row.prop
    if (row.order === 'ascending') {
      // 正序
      value!.query.sortType = 'asc'
    } else if (row.order === 'descending') {
      // 倒序
      value!.query.sortType = 'desc'
    } else {
      value!.query.sortType = ''
    }
    emit('update:modelValue', value)
  }
  emit('sort-change')
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
  if (label.indexOf('common.') >= 0) {
    return tg(label)
  }
  return messages.value[label]
}
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
@import '../style/var.scss';

.chant-table {
  flex: 1;
  margin-top: 5px;
  ::v-deep(.link) {
    color: $color-base;
    cursor: pointer;
    overflow: hidden;
    text-decoration: underline;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .table-icon-copy {
    color: $color-base;
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
