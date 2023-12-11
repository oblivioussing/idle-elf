<template>
  <el-table
    ref="tableRef"
    v-loading="props?.modelValue?.loading || false"
    v-bind="$attrs"
    :border="true"
    class="chant-table"
    :data="props.list || props?.modelValue?.list"
    :empty-text="props?.emptyText"
    :height="state.height ? state.height : undefined"
    :highlight-current-row="props.highlightCurrentRow"
    :row-key="props.rowKey"
    :show-summary="props?.showSummary"
    :span-method="props?.objectSpanMethod"
    :summary-method="props?.summaryMethod"
    @row-click="onRowClick"
    @row-dblclick="onRowDbClick"
    @select="onSelect"
    @select-all="onSelectAll"
    @selection-change="onSelectionChange"
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
      <template
        v-for="(item, index) in props.columns || props?.modelValue?.columns">
        <el-table-column
          v-if="showColumnItem(item, index)"
          v-bind="item"
          :min-width="item.width || columnWidth || 144"
          :align="item.align || 'center'"
          :fixed="item.fixed"
          :sortable="props.sortable"
          :show-overflow-tooltip="state.showOverflowTooltip">
          <template #header>
            <span>{{ item.label }}</span>
          </template>
          <template #="scope">
            <div class="flex-center">
              <!-- slot -->
              <slot
                v-if="item.slot"
                :row="scope.row"
                :name="item.prop"
                :item="item"
                :value="scope.row[item.prop]"
                :index="scope.$index"
                :label="item.label">
              </slot>
              <!-- 格式化 -->
              <template
                v-else-if="item.format || item.type === FormType.Select">
                <!-- dict -->
                <el-tag
                  v-if="
                    item.format === FormatEnum.Dict ||
                    item.type === FormType.Select
                  "
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
                <template v-if="item.appendLabel">
                  {{ item.appendLabel }}
                </template>
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
import { ElMessage } from 'element-plus'
// @ts-ignore
import Sortable from 'sortablejs'
import {
  nextTick,
  onActivated,
  onMounted,
  reactive,
  ref,
  useSlots,
  watch,
  type InputHTMLAttributes
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useClipboard from 'vue-clipboard3'
import { DocumentCopy } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import { Format as FormatEnum, FormType } from '../enum'
import { type ListColumn as Column, type ListState } from '../type'
import { useLister } from '../use'
import { base, format } from '../utils'

interface Props {
  columnWidth?: number // 列宽度
  dbEdit?: boolean // 是否双击编辑
  detailParams?: Record<string, any> // 跳转详情页面额外参数
  dict?: Record<string, any> // 字典
  linkData?: any[] // 链接数据
  modelValue?: ListState // modelValue
  lang?: Record<string, any> // 国际化
  list?: any // 列表数据
  columns?: Column[] // 列表字段
  heightWild?: boolean // 高度不限制
  highlightCurrentRow?: boolean // 高亮当前选中行
  rowKey?: string // 行数据的key
  picker?: boolean // 是否为选择器
  multiplePageSelection?: boolean // 是否可以多页面选中
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
  rowKey: 'id',
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
// VModel
const vModel = useVModel(props, 'modelValue', emit)
// defineExpose
defineExpose({
  scrollToBottom, // 滚动到底部
  setSelection, // 设置选中的selection
  tableAdapter // 容器自适应
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
// ref
const tableRef = ref()
// state
const state = reactive({
  height: 0,
  showOverflowTooltip: true
})
// resize
window.addEventListener('resize', () => {
  // 列表容器自适应
  tableAdapter()
})
// 初始化
onMounted(() => {
  // 列表容器自适应
  tableAdapter()
  // 拖拽
  sortCreate()
  // 设置行的光标
  setRowPointer()
  // 设置选中的selection
  setSelection()
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
    // 设置行的光标
    setRowPointer()
    // 设置选中的selection
    setSelection()
  },
  { deep: true }
)
// 是否显示该项
function showColumnItem(row: Column, index: number) {
  if (row.onlySearch) {
    return false
  }
  if (row.hide) {
    return false
  }
  if (row.showCustom) {
    const list = props.list || props?.modelValue?.list
    return row?.showCustom(list[index])
  }
  return true
}
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
// 字典格式化
function dictFmt(prop: string, value: any) {
  const dict = props.dict || props.modelValue?.dict
  if (!dict![prop]) {
    return
  }
  return dict![prop][value]
}
// 设置选中的selection
function setSelection() {
  tableRef.value?.clearSelection()
  setTimeout(() => {
    const field = props.rowKey
    const value = vModel.value
    const rows = value?.list?.filter((item) => {
      return value?.selectionList?.find((child) => child[field] === item[field])
    })
    if (value?.selectionList.length) {
      value.selectionIdList = value.selectionList.map((item) => item[field])
    }
    if (rows?.length) {
      nextTick(() => {
        rows?.forEach((item) => {
          tableRef.value?.toggleRowSelection(item, true)
        })
      })
    }
  }, 100)
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
// 勾选处理
function selectHandle(type: 'checked' | 'remove', index: number, row: any) {
  const value = vModel.value!
  const selectionList = value.selectionList
  if (type === 'checked') {
    selectionList.push(row)
    emit('select-add', row)
  } else {
    selectionList.splice(index, 1)
    emit('select-remove', row)
  }
  emit('select', { selection: selectionList, row })

  value.selectionIdList = selectionList.map((item) => item[props.rowKey])
  value.selectionId = selectionList[0]?.[props.rowKey]
  value.selectionRow = selectionList[0] || {}
}
// 勾选数据行
function onSelect(selection: any[], row: any) {
  const selectionList = vModel.value!.selectionList
  const id = props.rowKey
  const index = selectionList.findIndex((item) => item[id] === row[id])
  const type = selection.length > selectionList.length ? 'checked' : 'remove'
  selectHandle(type, index, row)
}
// 手动勾选全选
function onSelectAll(selection: any[]) {
  const value = vModel.value!
  const selectionList = value.selectionList
  let list: any[] | undefined
  if (selection.length) {
    list = selectionList?.concat(selection)
  } else {
    list = selectionList?.filter(
      (item) =>
        !value.list.find((child) => child[props.rowKey] === item[props.rowKey])
    )
  }
  value.selectionList = base.distinct(list)
  value.selectionIdList = value.selectionList.map((item) => item[props.rowKey])
  emit('select-all', selection)
}
// 选择项发生变化
function onSelectionChange(selection: any[]) {
  if (!props.multiplePageSelection) {
    const value = vModel.value!
    nextTick(() => {
      value.selectionList = selection
      value.selectionIdList = value.selectionList.map(
        (item) => item[props.rowKey]
      )
      value.selectionId = selection[0]?.[props.rowKey]
      value.selectionRow = selection[0] || {}
    })
  }
}
// 单元格点击
function onRowClick(row: any) {
  emit('row-click', row)
  // 如果高亮当前选中行,需要重新设置标光
  if (props.highlightCurrentRow) {
    // 设置行的光标
    setRowPointer()
  }
  if (props.showSelection && props.rowSelection) {
    const id = props.rowKey
    const value = vModel.value!
    const selectionList = value.selectionList
    const index = selectionList.findIndex((item) => item[id] === row[id])
    tableRef.value?.toggleRowSelection(row, index < 0)
    const type = index >= 0 ? 'remove' : 'checked'
    selectHandle(type, index, row)
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
    const value = vModel.value
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
  }
  emit('sort-change')
}
// 复制
async function onCopy(text: string) {
  try {
    await toClipboard(text)
    ElMessage.success('复制成功')
  } catch (e) {
    console.error(e)
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped lang="scss">
.chant-table {
  flex: 1;
  margin-top: 5px;
  overflow: hidden;
  ::v-deep(.link) {
    color: #409eff;
    cursor: pointer;
    overflow: hidden;
    text-decoration: underline;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .table-icon-copy {
    color: #409eff;
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
