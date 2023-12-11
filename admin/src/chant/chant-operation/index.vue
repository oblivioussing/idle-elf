<template>
  <div class="chant-operation">
    <!-- search -->
    <div v-if="props.showSearch" class="toolbar chant-search" ref="searchRef">
      <!-- form -->
      <el-form :inline="true" class="form m-r-10" @keyup.enter="onEnter">
        <slot></slot>
        <!-- 查询条件 -->
        <template v-for="item in props.modelValue.columns">
          <el-form-item v-if="isShowSearch(item)" :content="item.label">
            <!-- slot -->
            <slot v-if="item.searchSlot" :name="item.prop" :row="item"></slot>
            <!-- input -->
            <el-input
              v-else-if="isInput(item)"
              v-model="state.query[item.like ? item.prop + 'Like' : item.prop]"
              :placeholder="item.label"
              :clearable="item.clearable === false ? false : true">
              <template v-if="item.appendLabel" #append>
                {{ item.appendLabel }}
              </template>
            </el-input>
            <!-- select -->
            <el-select
              v-else-if="item.type === FormType.Select"
              v-model="state.query[item.prop]"
              :placeholder="item.label"
              :clearable="item.clearable === false ? false : true"
              @change="onQueryChange">
              <el-option
                v-for="(val, key) in props.modelValue?.dict![item.prop]"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
            <!-- date,datetime -->
            <el-date-picker
              v-else-if="isDate(item)"
              v-model="state.query[item.prop]"
              :type="item.type as any"
              :value-format="item.valueFormat || 'x'"
              :placeholder="item.label"
              :clearable="item.clearable === false ? false : true"
              @change="onQueryChange">
            </el-date-picker>
            <!-- daterange,datetimerange -->
            <el-date-picker
              v-else-if="isDateRange(item)"
              v-model="state.dateRange[item.prop]"
              :type="item.type as any"
              :value-format="item.valueFormat || 'x'"
              :clearable="item.clearable === false ? false : true"
              :start-placeholder="item.label"
              :end-placeholder="item.label"
              :default-time="defaultTime"
              @change="onDateRange(item)">
            </el-date-picker>
            <!-- range -->
            <div v-else-if="item.type === FormType.Range" class="input-range">
              <el-input
                v-model="state.query[rangeField(item, 'start')]"
                :clearable="item.clearable === false ? false : true"
                :placeholder="item.label">
                <template v-if="item.appendLabel" #append>
                  {{ item.label }}
                </template>
              </el-input>
              <div class="connector">~</div>
              <el-input
                v-model="state.query[rangeField(item, 'end')]"
                :clearable="item.clearable === false ? false : true"
                :placeholder="item.label">
                <template v-if="item.appendLabel" #append>
                  {{ item.label }}
                </template>
              </el-input>
            </div>
          </el-form-item>
        </template>
        <slot name="search-end"></slot>
      </el-form>
      <template v-if="props.showFold">
        <!-- 展开搜索 -->
        <chant-icon-button
          v-if="state.arrow === 'down'"
          content="展开搜索"
          :icon="ArrowDown"
          type="primary"
          @click="onCollapse('up')">
        </chant-icon-button>
        <!-- 关闭搜索 -->
        <chant-icon-button
          v-if="state.arrow === 'up'"
          content="关闭搜索"
          :icon="ArrowUp"
          type="primary"
          @click="onCollapse('down')">
        </chant-icon-button>
      </template>
      <!-- 查询,刷新 -->
      <el-button-group class="m-l-10">
        <!-- 查询 -->
        <chant-icon-button
          @click="onEmit('query')"
          content="查询"
          :icon="Search"
          type="primary">
        </chant-icon-button>
        <!-- 刷新 -->
        <chant-icon-button
          @click="onEmit('refresh')"
          content="刷新"
          :icon="Refresh"
          type="primary">
        </chant-icon-button>
      </el-button-group>
    </div>
    <!-- operation -->
    <table-operation
      v-if="props.showOperation"
      :columns="props.modelValue.columns!"
      :messages="props.modelValue.lang"
      :options="props.options"
      :show-checked-all="props.showCheckedAll"
      :show-filter="props.showFilter"
      :total="props.modelValue.total"
      @emit="onEmit"
      @checked="onAllChecked"
      @column-change="onColumnChange">
      <slot name="group"></slot>
      <template #alone>
        <slot name="alone"></slot>
      </template>
    </table-operation>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'
import { ArrowDown, ArrowUp, Refresh, Search } from '@element-plus/icons-vue'
import { FormType } from '@/enum'
import { type ListColumn as Column, type ListState } from '@/type'
import TableOperation from './components/TableOperation.vue'

type Options = 'add' | 'edit' | 'delete' | 'copy-add' | 'export' | 'void'

interface Props {
  modelValue: ListState // modelValue
  options?: Options[] // 操作按钮选项
  showCheckedAll?: boolean // 显示全部
  showFilter?: boolean // 显示字段过滤
  showFold?: boolean // 显示折叠按钮
  showOperation?: boolean // 显示列表操作按钮
  showSearch?: boolean // 显示查询栏
  unfold?: boolean // 自动展开搜索条件
}
const defaultTime: [Date, Date] = [
  new Date(2022, 1, 1, 0, 0, 0),
  new Date(2022, 1, 1, 23, 59, 59)
]
// props
const props = withDefaults(defineProps<Props>(), {
  showFilter: true, // 显示字段过滤
  showFold: true, // 显示折叠按钮
  showOperation: true, // 显示列表操作按钮
  showSearch: true, // 显示查询栏
  unfold: false // 自动展开搜索条件
})
// emit
const emit = defineEmits([
  'update:modelValue',
  'query',
  'refresh',
  'add',
  'copy-add',
  'delete',
  'edit',
  'sort',
  'export',
  'void'
])
// ref
const searchRef = ref()
// state
const state = reactive({
  allFlag: props.modelValue.allFlag,
  dict: props.modelValue.dict,
  tenant: props.modelValue.tenant,
  query: props.modelValue.query,
  pages: props.modelValue.pages,
  arrow: props.unfold ? 'up' : 'down',
  dateRange: {} as any
})
// defineExpose
defineExpose({
  containerAuto // 容器高度自适应
})
// watch
watch(
  () => props.modelValue.query,
  () => {
    state.query = props.modelValue.query
  }
)
watch(
  () => props.modelValue.columns,
  () => {
    containerAuto()
  },
  { deep: true }
)
watch(
  () => props.modelValue.dict,
  () => {
    state.dict = props.modelValue.dict
  }
)
// init
setDefaultValue() // 设置默认值
containerAuto() // 容器高度自适应
// 设置默认值
function setDefaultValue() {
  const query = props.modelValue.query
  props.modelValue.columns?.forEach((item) => {
    if (item.defaultValue) {
      if (isDateRange(item)) {
        const start = rangeField(item, 'start')
        const end = rangeField(item, 'end')
        state.dateRange[item.prop] = [query[start], query[end]]
      } else {
        state.query[item.prop] = query[item.prop]
      }
    }
  })
}
// 是否显示搜索条件
function isShowSearch(column: Column) {
  if (column.showCustom) {
    return column.showCustom({})
  }
  if (column.hide) {
    return
  }
  if (!column.search && !column.onlySearch) {
    return false
  }
  return true
}
// range start
function rangeField(column: Column, type: 'start' | 'end') {
  const suffix = type.replace(/^\S/, (s) => s.toUpperCase())
  return column[type] || `${column.prop}${suffix}`
}
// column change
function onColumnChange(columns: Column[]) {
  const value = props.modelValue
  value.columns = columns
  emit('update:modelValue', value)
}
// 查询条件修改
function onQueryChange() {
  nextTick(() => {
    emit('query')
  })
}
// 回车事件
function onEnter() {
  emit('query')
}
// 是否为input
function isInput(row: Column) {
  if (row.type === FormType.Input) {
    return true
  }
  return !row.type && !row.searchSlot
}
// 是否为date
function isDate(row: Column) {
  if (row.type) {
    return [FormType.Date, FormType.DateTime, FormType.Month].includes(row.type)
  }
}
// 是否为daterange
function isDateRange(row: Column) {
  if (row.type) {
    return [
      FormType.Daterange,
      FormType.Datetimerange,
      FormType.Monthrange
    ].includes(row.type)
  }
}
// 日期范围选择
function onDateRange(row: Column) {
  const prop = row.prop
  let value = state.dateRange[prop]
  if (!value) {
    value = ['', '']
  }
  state.query[rangeField(row, 'start')] = value[0]
  state.query[rangeField(row, 'end')] = value[1]
  emit('query')
}
// 展开/关闭
function onCollapse(type: 'down' | 'up') {
  state.arrow = type
  const el = searchRef.value
  if (type === 'up') {
    el.style.height = 'auto'
    const height = el.offsetHeight
    if (height < 50) {
      setTimeout(() => {
        el.style.height = '24px'
      }, 0)
      return
    }
    // setTimeout(() => {
    //   el.style.height = height + 'px'
    // }, 0)
  } else {
    el.style.height = '24px'
  }
}
// 容器高度自适应
function containerAuto() {
  if (state.arrow === 'down') {
    return
  }
  setTimeout(() => {
    const el = searchRef.value
    el.style.height = 'auto'
    // wjh注释，发现月份流水里高度过高
    // const height = el.offsetHeight
    // el.style.height = height + 'px'
  }, 300)
}
// emit
function onEmit(type: any) {
  if (type === 'refresh') {
    // 清空查询条件
    reset()
  }
  emit(type)
}
// 清空查询条件
function reset() {
  state.dateRange = {}
  // 设置默认值
  setDefaultValue()
  for (let item in state.query) {
    if (!['page', 'size'].includes(item)) {
      state.query[item] = ''
    }
  }
}
// 全选
function onAllChecked(checked: boolean) {
  const value = props.modelValue
  value.allFlag = checked ? 1 : 0
  emit('update:modelValue', value)
}
</script>

<style lang="scss">
$input-width: 165px;

.chant-search {
  display: flex;
  height: 24px;
  overflow: hidden;
  // transition: height 0.3s;
  .form {
    flex: 1;
    margin-top: -10px;
    .tenant-seat {
      display: inline-block;
      min-width: 195px;
    }
    .el-form-item {
      margin: 10px 10px 0 0 !important;
    }
    .input-range {
      display: flex;
      align-items: center;
      .el-input {
        width: $input-width;
      }
      .connector {
        text-align: center;
        width: 32px;
      }
    }
    .el-input {
      min-width: $input-width;
      .el-input-group__append,
      .el-input-group__prepend {
        padding: 0 6px;
      }
    }
    // date
    .el-date-editor.el-input {
      width: $input-width;
    }
    .el-range-editor.el-input__inner {
      background-color: #ffffff;
      width: 362px;
    }
    // tanent-picker
    .picker-input {
      width: $input-width;
    }
  }
  .icon-jinggao {
    color: #333744;
    margin-left: 5px;
  }
}
</style>
