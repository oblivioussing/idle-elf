<template>
  <div class="chant-operation">
    <!-- search -->
    <div v-if="props.showSearch" class="toolbar chant-search" ref="searchRef">
      <!-- form -->
      <el-form class="form m-r-10" :inline="true" @keyup.enter="emits('query')">
        <slot name="search-start"></slot>
        <!-- 查询条件 -->
        <el-form-item v-for="item in columnsList">
          <!-- input -->
          <el-input
            v-if="formUtils.isInput(item)"
            v-model="vModel.query[item.like ? item.prop + 'Like' : item.prop]"
            :clearable="item.clearable !== false"
            :placeholder="translate(item)">
            <template v-if="item.appendLabel" #append>
              {{ tg(item.appendLabel) }}
            </template>
          </el-input>
          <!-- input-number -->
          <el-input-number
            v-else-if="item.type === FormTypeEnum.InputNumber"
            v-model="vModel.query[item.prop]"
            controls-position="right"
            :placeholder="translate(item)">
          </el-input-number>
          <!-- select -->
          <el-select
            v-else-if="item.type === FormTypeEnum.Select"
            v-model="vModel.query[item.prop]"
            :clearable="item.clearable !== false"
            :placeholder="translate(item)"
            @change="emits('query')">
            <el-option
              v-for="(val, key) in vModel?.dict![item.prop]"
              :label="val"
              :value="key">
            </el-option>
          </el-select>
          <!-- date,datetime -->
          <el-date-picker
            v-else-if="formUtils.isDate(item)"
            v-model="vModel.query[item.prop]"
            :clearable="item.clearable !== false"
            :placeholder="translate(item)"
            :type="columnType(item.type)"
            :value-format="item.valueFormat || 'x'"
            @change="emits('query')">
          </el-date-picker>
          <!-- daterange,datetimerange -->
          <el-date-picker
            v-else-if="formUtils.isDateRange(item)"
            v-model="state.dateRange[item.prop]"
            :clearable="item.clearable !== false"
            :start-placeholder="translate(item)"
            :end-placeholder="translate(item)"
            :type="columnType(item.type)"
            :value-format="item.valueFormat || 'x'"
            @change="onDateRange(item)">
          </el-date-picker>
          <!-- range -->
          <div
            v-else-if="item.type === FormTypeEnum.InputNumberRange"
            class="input-range">
            <el-input-number
              v-model="vModel.query[rangeField(item, 'start')]"
              controls-position="right"
              :placeholder="translate(item)">
            </el-input-number>
            <div class="connector">~</div>
            <el-input-number
              v-model="vModel.query[rangeField(item, 'end')]"
              controls-position="right"
              :placeholder="translate(item)">
            </el-input-number>
          </div>
          <!-- slot -->
          <slot v-else-if="item.searchSlot" :name="item.prop" :row="item">
          </slot>
        </el-form-item>
        <slot name="search-end"></slot>
      </el-form>
      <template v-if="props.showFold">
        <!-- 展开搜索 -->
        <chant-button
          v-if="state.arrow === 'down'"
          :content="t('spread')"
          :icon="ArrowDown"
          @click="onCollapse('up')">
        </chant-button>
        <!-- 关闭搜索 -->
        <chant-button
          v-if="state.arrow === 'up'"
          :content="t('fold')"
          :icon="ArrowUp"
          @click="onCollapse('down')">
        </chant-button>
      </template>
      <!-- 查询,刷新 -->
      <el-button-group class="m-l-10">
        <!-- 查询 -->
        <chant-button
          :content="t('query')"
          :icon="Search"
          @click="onEmit('query')">
        </chant-button>
        <!-- 刷新 -->
        <chant-button
          :content="t('refresh')"
          :icon="Refresh"
          @click="onEmit('refresh')">
        </chant-button>
      </el-button-group>
    </div>
    <!-- operation -->
    <table-operation
      v-if="props.showOperation"
      v-model="vModel"
      :options="props.options"
      :show-checked-all="props.showCheckedAll"
      :show-filter="props.showFilter"
      @emit="onEmit">
      <slot></slot>
    </table-operation>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDown, ArrowUp, Refresh, Search } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import { formUtils, type ListColumn as Column, type ListState } from '@/chant'
import { FormTypeEnum } from '@/chant'
import { vuei18n } from '@/plugs'
import TableOperation from './components/TableOperation.vue'

type Options = 'add' | 'edit' | 'delete' | 'copy-add'

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
// props
const props = withDefaults(defineProps<Props>(), {
  showFilter: true, // 显示字段过滤
  showFold: true, // 显示折叠按钮
  showOperation: true, // 显示列表操作按钮
  showSearch: true, // 显示查询栏
  unfold: false // 自动展开搜索条件
})
// emits
const emits = defineEmits([
  'add',
  'copy-add',
  'delete',
  'edit',
  'query',
  'refresh',
  'update:modelValue'
])
// use
const { t: tg } = useI18n({ useScope: 'global' })
const { t } = useI18n({
  messages: {
    en: {
      spread: 'spread search',
      fold: 'fold fold',
      query: 'query',
      refresh: 'refresh'
    },
    zh: {
      spread: '展开搜索',
      fold: '折叠搜索',
      query: '查询',
      refresh: '刷新'
    }
  }
})
const vModel = useVModel(props, 'modelValue', emits)
// ref
const searchRef = ref()
// state
const state = reactive({
  arrow: props.unfold ? 'up' : 'down',
  dateRange: {} as any
})
// computed
const columnsList = computed(() => {
  return vModel.value.columns?.filter((item) => {
    if (item.hide) {
      return false
    }
    return item.search || item.onlySearch
  })
})
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = vModel.value.lang
  return lang ? lang[locale] : {}
})
// watch
watch(columnsList, () => {
  setTimeout(() => {
    // 容器高度自适应
    containerAuto()
  }, 300)
})
// resize
window.addEventListener('resize', () => {
  // 容器高度自适应
  containerAuto()
})
// init
bindQueryValue() // 绑定查询条件的值
setTimeout(() => {
  containerAuto() // 容器高度自适应
}, 1500)
// 绑定查询条件的值
function bindQueryValue() {
  const query = vModel.value.query
  vModel.value.columns?.forEach((item) => {
    if (formUtils.isDateRange(item)) {
      const start = rangeField(item, 'start')
      const end = rangeField(item, 'end')
      state.dateRange[item.prop] = [query[start], query[end]]
    }
  })
}
// range start
function rangeField(column: Column, type: 'start' | 'end') {
  const suffix = type.replace(/^\S/, (s) => s.toUpperCase())
  const key = `dynamic${suffix}` as 'dynamicStart' | 'dynamicEnd'
  return column[key] || `${column.prop}${suffix}`
}
// 日期范围选择
function onDateRange(row: Column) {
  const prop = row.prop
  let value = state.dateRange[prop]
  if (!value) {
    value = ['', '']
  }
  vModel.value.query[rangeField(row, 'start')] = value[0]
  vModel.value.query[rangeField(row, 'end')] = value[1]
  emits('query')
}
// 展开/关闭
function onCollapse(type: 'down' | 'up') {
  state.arrow = type
  if (type === 'down') {
    searchRef.value.style.height = '48px'
  } else {
    // 容器高度自适应
    containerAuto()
  }
}
// 容器高度自适应
function containerAuto() {
  if (state.arrow === 'up') {
    const el = searchRef.value as HTMLElement
    el.style.height = 'auto'
    const height = el.offsetHeight
    el.style.height = '48px'
    setTimeout(() => {
      el.style.height = height + 'px'
    }, 0)
  }
}
// emit
function onEmit(type: any) {
  if (type === 'refresh') {
    // 清空查询条件
    reset()
  }
  emits(type)
}
// 清空查询条件
function reset() {
  state.dateRange = {}
  for (let item in vModel.value.query) {
    if (!['page', 'size'].includes(item)) {
      vModel.value.query[item] = ''
    }
  }
}
// type类型转化
function columnType(type?: FormTypeEnum) {
  return type as any
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

<style lang="scss">
$input-width: 165px;

.chant-search {
  box-sizing: border-box;
  display: flex;
  height: 48px;
  overflow: hidden;
  transition: height 0.3s;
  .form {
    flex: 1;
    margin-top: -10px;
    .el-form-item {
      margin: 12px 10px 0 0;
    }
    // range
    .input-range {
      display: flex;
      align-items: center;
      .el-input-number {
        width: 154px;
      }
      .connector {
        text-align: center;
        width: 32px;
      }
    }
    // input
    .el-input {
      width: $input-width;
      .el-input-group__append,
      .el-input-group__prepend {
        padding: 0 6px;
      }
    }
    // input-number
    .el-input-number {
      width: $input-width;
    }
    // date
    .el-date-editor.el-input {
      width: $input-width;
    }
    .el-range-editor.el-input__wrapper {
      background-color: #ffffff;
      box-sizing: border-box;
      width: 340px;
    }
  }
}
</style>
