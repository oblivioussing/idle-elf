<template>
  <div class="chant-operation">
    <!-- search -->
    <div v-if="props.showSearch" class="toolbar chant-search" ref="searchRef">
      <!-- form -->
      <el-form :inline="true" class="form m-r-10" @keyup.enter="onEnter">
        <slot></slot>
        <!-- 系统类型-租户选择 -->
        <span v-if="showSysTenant()" class="tenant-seat">
          <chant-sys-tenant
            v-model="state.tenant"
            :clearable="props.systemClearable"
            :tenant-tips="props.tenantTips"
            :tenant-classify="props.tenantClassify"
            :api-url="props.tenantApiUrl"
            type="search"
            @change="onSysTenant">
          </chant-sys-tenant>
        </span>
        <!-- 查询条件 -->
        <template v-for="item in props.modelValue.columns">
          <chant-search-item
            v-if="isShowSearch(item)"
            :content="translate(item)">
            <!-- slot -->
            <slot v-if="item.searchSlot" :name="item.prop" :row="item"></slot>
            <!-- input -->
            <el-input
              v-else-if="isInput(item)"
              v-model="state.query[item.like ? item.prop + 'Like' : item.prop]"
              :placeholder="translate(item)"
              :clearable="item.clearable === false ? false : true">
              <template v-if="item.appendLabel" #append>
                {{ tg(item.appendLabel as string) }}
              </template>
            </el-input>
            <!-- select -->
            <el-select
              v-else-if="item.type === FormType.Select"
              v-model="state.query[item.prop]"
              :placeholder="translate(item)"
              :clearable="item.clearable === false ? false : true"
              @change="onQueryChange">
              <el-option
                v-for="(val, key) in  props.modelValue?.dict![item.prop]"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
            <!-- date,datetime -->
            <el-date-picker
              v-else-if="isDate(item)"
              v-model="state.query[item.prop]"
              :type="(item.type as any)"
              :value-format="item.valueFormat || 'x'"
              :placeholder="translate(item)"
              :clearable="item.clearable === false ? false : true"
              @change="onQueryChange">
            </el-date-picker>
            <!-- daterange,datetimerange -->
            <el-date-picker
              v-else-if="isDateRange(item)"
              v-model="state.dateRange[item.prop]"
              :type="(item.type as any)"
              :value-format="item.valueFormat || 'x'"
              :clearable="item.clearable === false ? false : true"
              :start-placeholder="translate(item)"
              :end-placeholder="translate(item)"
              :default-time="defaultTime"
              @change="onDateRange(item)">
            </el-date-picker>
            <!-- range -->
            <div v-else-if="item.type === FormType.Range" class="input-range">
              <el-input
                v-model="state.query[rangeField(item, 'start')]"
                :clearable="item.clearable === false ? false : true"
                :placeholder="translate(item)">
                <template v-if="item.appendLabel" #append>
                  {{ tg(item.appendLabel as string) }}
                </template>
              </el-input>
              <div class="connector">~</div>
              <el-input
                v-model="state.query[rangeField(item, 'end')]"
                :clearable="item.clearable === false ? false : true"
                :placeholder="translate(item)">
                <template v-if="item.appendLabel" #append>
                  {{ tg(item.appendLabel as string) }}
                </template>
              </el-input>
            </div>
            <!-- tenant picker -->
            <chant-tenant-picker
              v-else-if="item.type === FormType.TenantPicker"
              v-model:id="state.query[item.dynamicId || item.prop]"
              :api-url="item.apiUrl"
              :clearable="item.clearable === false ? false : true"
              :tenant-classify="item.tenantClassify"
              @change="onQueryChange">
            </chant-tenant-picker>
            <!-- department picker -->
            <chant-department-picker
              v-else-if="item.type === FormType.DepartmentPicker"
              v-model:id="state.query[item.dynamicId || item.prop]"
              @change="onQueryChange">
            </chant-department-picker>
            <!-- user picker -->
            <chant-user-picker
              v-else-if="item.type === FormType.UserPicker"
              v-model:id="state.query[item.dynamicId || item.prop]"
              :api-url="item.apiUrl"
              :placeholder="translate(item)"
              @change="onQueryChange">
            </chant-user-picker>
            <!-- product picker -->
            <chant-product-picker
              v-else-if="item.type === FormType.ProductPicker"
              v-model:id="state.query[item.dynamicId || item.prop]"
              :disabled="!state.query.entrustTenantId"
              :sys-code="SysCode.Admin"
              :tenant-id="state.query.entrustTenantId"
              @change="onQueryChange">
            </chant-product-picker>
          </chant-search-item>
        </template>
        <slot name="search-end"></slot>
      </el-form>
      <template v-if="props.showFold">
        <!-- 展开搜索 -->
        <chant-icon-button
          v-if="state.arrow === 'down'"
          :content="tg('button.spreadSearch')"
          :icon="ArrowDown"
          type="primary"
          @click="onCollapse('up')">
        </chant-icon-button>
        <!-- 关闭搜索 -->
        <chant-icon-button
          v-if="state.arrow === 'up'"
          :content="tg('button.closeSearch')"
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
          :content="tg('button.query')"
          :icon="Search"
          type="primary">
        </chant-icon-button>
        <!-- 刷新 -->
        <chant-icon-button
          @click="onEmit('refresh')"
          :content="tg('button.refresh')"
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
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown, ArrowUp, Refresh, Search } from '@element-plus/icons-vue'
import { core } from '../../share'
import { SysCode, FormType, TenantClassify } from '../../enum'
import { vuei18n } from '../../plugs'
import { ListColumn as Column, ListState } from '../../type'
import TableOperation from './components/TableOperation.vue'
import ChantDepartmentPicker from '../chant-department-picker/index.vue'
import ChantUserPicker from '../chant-user-picker/index.vue'
import ChantProductPicker from '../chant-product-picker/index.vue'

type Options = 'add' | 'edit' | 'delete' | 'copy-add' | 'export' | 'void'

interface Props {
  modelValue: ListState // modelValue
  options?: Options[] // 操作按钮选项
  showCheckedAll?: boolean // 显示全部
  showFilter?: boolean // 显示字段过滤
  showFold?: boolean // 显示折叠按钮
  showOperation?: boolean // 显示列表操作按钮
  showSearch?: boolean // 显示查询栏
  showTenant?: boolean // 显示系统类型租户选择
  systemClearable?: boolean // 系统类型是否可清空
  tenantApiUrl?: string // 租户查询api
  tenantClassify?: TenantClassify // 租户分类
  tenantTips?: string // 租户文本提示
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
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
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
// computed
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = props.modelValue.lang
  if (lang) {
    return lang[locale]
  } else {
    return {}
  }
})
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
// 是否显示sys-tenant
function showSysTenant() {
  if (core.isPta() && !props.tenantClassify) {
    return false
  }
  return props.showTenant
}
// 系统类型 - 租户选择 change
function onSysTenant(row: any) {
  const value = props.modelValue
  value.pages = state.pages
  value.pages.pageNum = 1
  value.tenant = row
  emit('update:modelValue', value)
  const { tenantId, sysCode } = value.tenant || {}
  if (tenantId || sysCode === SysCode.Platform || !sysCode) {
    emit('query')
  } else {
    value.list = []
  }
  containerAuto()
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
        el.style.height = '44px'
      }, 0)
      return
    }
    // setTimeout(() => {
    //   el.style.height = height + 'px'
    // }, 0)
  } else {
    el.style.height = '44px'
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
    const height = el.offsetHeight
    el.style.height = height + 'px'
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
// 翻译
function translate(column: Column) {
  let label = column.label || column.prop
  if (label.indexOf('common.') >= 0) {
    return tg(label)
  }
  return messages.value[label] || ''
}
</script>

<style lang="scss">
@import '../../style/var.scss';

$input-width: 165px;

.chant-search {
  display: flex;
  height: 44px;
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
      background-color: $color-white;
      width: 362px;
    }
    // tanent-picker
    .picker-input {
      width: $input-width;
    }
  }
  .icon-jinggao {
    color: $color-black;
    margin-left: 5px;
  }
}
</style>
