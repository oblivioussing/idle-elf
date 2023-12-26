<template>
  <div class="chant-form">
    <el-form
      :label-width="props.labelWidth || '100px'"
      :model="vModel.form"
      ref="formRef">
      <template v-for="item in columnsList" :key="item.prop">
        <!-- divider -->
        <el-divider v-if="item.title" content-position="left">
          {{ translate(item) }}
        </el-divider>
        <!-- chant-form-item -->
        <div
          v-else
          class="chant-form-item"
          :class="{ 'textarea-box': item.type === FormTypeEnum.Textarea }">
          <el-form-item
            :label="translate(item) + ':'"
            :prop="item.prop"
            :rules="rules(item)">
            <!-- input -->
            <el-input
              v-if="formUtils.isInput(item)"
              v-model="vModel.form[item.prop]"
              :clearable="item.clearable !== false"
              :placeholder="translate(item, 'enter')"
              :rows="item.rows || 3"
              :type="item.type">
              <template v-if="item.prepend" #prepend>
                {{ tg(item.prepend) }}
              </template>
              <template v-else-if="item.append" #append>
                {{ tg(item.append) }}
              </template>
            </el-input>
            <!-- select -->
            <el-select
              v-else-if="item.type === FormTypeEnum.Select"
              v-model="vModel.form[item.prop]"
              :clearable="item.clearable !== false"
              :multiple="item.selectMultiple"
              :placeholder="translate(item, 'select')"
              @change="onChange(item)">
              <el-option
                v-for="(val, key) in vModel?.dict![item.prop]"
                :label="val"
                :value="key">
              </el-option>
            </el-select>
            <!-- slot -->
            <slot
              v-else-if="item.slot"
              :name="item.prop"
              :label="translate(item)"
              :row="item"
              :value="vModel.form[item.prop]">
            </slot>
            <!-- timepicker -->
            <el-time-picker
              v-else-if="item.type === FormTypeEnum.TimePicker"
              v-model="vModel.form[item.prop]"
              :clearable="item.clearable !== false"
              :placeholder="translate(item, 'select')"
              :value-format="item.valueFormat || 'HH:mm:ss'">
            </el-time-picker>
            <!-- date,datetime -->
            <el-date-picker
              v-else-if="formUtils.isDate(item)"
              v-model="vModel.form[item.prop]"
              :clearable="item.clearable !== false"
              :disabled="isDisabled(item)"
              :placeholder="translate(item, 'select')"
              :type="columnType(item.type)"
              :value-format="item.valueFormat || 'x'">
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
            <!-- input-number -->
            <el-input-number
              v-else-if="item.type === FormTypeEnum.InputNumber"
              v-model="vModel.form[item.prop]"
              controls-position="right"
              :placeholder="translate(item, 'enter')">
            </el-input-number>
            <!-- range -->
            <div
              v-else-if="item.type === FormTypeEnum.InputNumberRange"
              class="input-range">
              <el-input-number
                v-model="vModel.form[rangeField(item, 'start')]"
                controls-position="right"
                :placeholder="translate(item)">
              </el-input-number>
              <div class="connector">~</div>
              <el-input-number
                v-model="vModel.form[rangeField(item, 'end')]"
                controls-position="right"
                :placeholder="translate(item)">
              </el-input-number>
            </div>
            <!-- radio -->
            <el-radio-group
              v-else-if="item.type === FormTypeEnum.Radio"
              v-model="vModel.form[item.prop]"
              :disabled="isDisabled(item)"
              :placeholder="translate(item, 'select')">
              <el-radio
                v-for="(val, key) in vModel.dict?.[item.prop]"
                :label="key">
                {{ val }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { computed, onMounted, reactive, ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'
import {
  formUtils,
  FormTypeEnum,
  PageTypeEnum,
  type Dict,
  type FormColumn as Column
} from '@/chant'
import { vuei18n } from '@/plugs'

// type
type ModelValue = {
  dict?: Dict
  form: any
  formLoading: boolean
  model?: Column[]
  lang?: any
}
// props
const props = defineProps<{
  labelWidth?: string // label宽度
  modelValue: ModelValue // modelValue
  pageType?: PageTypeEnum // 页面类型
}>()
// emits
const emits = defineEmits(['instance', 'update:modelValue'])
// use
const { t: tg } = useI18n({ useScope: 'global' })
const vModel = useVModel(props, 'modelValue', emits)
// ref
const formRef = ref<FormInstance>()
// state
const state = reactive({
  dateRange: {} as any
})
// computed
const columnsList = computed(() => {
  return vModel.value.model?.filter((item) => {
    if (item.hide) {
      return false
    }
    if (item.hideInPage && item.hideInPage === props.pageType) {
      return false
    }
    if (item.showCustom) {
      return item?.showCustom(vModel.value)
    }
    return true
  })
})
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = vModel.value.lang
  return lang ? lang[locale] : {}
})
// onMounted
onMounted(() => {
  // 实例更新
  emits('instance', formRef.value)
  // 初始化
  init()
})
// 初始化
function init() {
  const model = vModel.value.model
  model?.forEach((item) => {
    // date range
    if (formUtils.isDateRange(item)) {
      const start = rangeField(item, 'start')
      // watch
      watch(
        () => vModel.value.form[start],
        () => {
          // daterange赋值
          dateRangeVoluation(item)
        }
      )
    }
  })
}
// type类型转化
function columnType(type?: FormTypeEnum) {
  return type as any
}
// daterange赋值
function dateRangeVoluation(column: Column) {
  const start = rangeField(column, 'start')
  const end = rangeField(column, 'end')
  const startTime = vModel.value.form[start]
  const endTime = vModel.value.form[end]
  if (startTime && endTime) {
    state.dateRange[column.prop] = [startTime, endTime]
  }
  if (!startTime && !endTime) {
    state.dateRange[column.prop] = [null, null]
  }
}
// 是否禁用
function isDisabled(row: Column) {
  if (typeof row.disabled === 'function') {
    return row.disabled(vModel.value.form)
  }
  if (row.disabledInPage && row.disabledInPage === props.pageType) {
    return true
  }
  return row.disabled
}
// 校验规则
function rules(column: Column) {
  if (column.required) {
    return [
      {
        required: true,
        message: translate(column) + tg('tips.required')
      }
    ]
  }
  return column.rules
}
// range start
function rangeField(column: Column, type: 'start' | 'end') {
  const suffix = type.replace(/^\S/, (s) => s.toUpperCase())
  const key = `dynamic${suffix}` as 'dynamicStart' | 'dynamicEnd'
  return column[key] || `${column.prop}${suffix}`
}
// change
function onChange(row: Column) {
  return row.change && row.change(vModel.value.form)
}
// 日期范围选择
function onDateRange(row: Column) {
  const prop = row.prop
  let value = state.dateRange[prop]
  if (!value) {
    value = ['', '']
  }
  vModel.value.form[rangeField(row, 'start')] = value[0]
  vModel.value.form[rangeField(row, 'end')] = value[1]
}
// 翻译
function translate(column: Column, type?: 'enter' | 'select') {
  const label = column.label || column.prop || column.title!
  const pattern = new RegExp('[\u4E00-\u9FA5]+')
  const map = {
    enter: tg('tips.enter'),
    select: tg('tips.select')
  }
  const tips = type ? map[type] : ''
  if (pattern.test(label)) {
    return tips + label
  }
  if (label.indexOf('.') >= 0) {
    return tips + tg(label)
  }
  return tips + messages.value[label]
}
</script>

<style lang="scss">
.chant-form {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 5px;
  overflow: auto;
  padding-right: 5px;
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
  // range
  .input-range {
    display: flex;
    align-items: center;
    .connector {
      text-align: center;
      width: 32px;
    }
  }
}
@container (min-width: 0) {
  .chant-form-item {
    width: 100%;
  }
}
@container (min-width: 600px) {
  .chant-form-item {
    width: 50%;
    &.textarea-box {
      width: 100%;
    }
  }
}
@container (min-width: 1000px) {
  .chant-form-item {
    width: 33.3333%;
    &.textarea-box {
      width: 100%;
      .el-form-item {
        width: 66.6666%;
      }
    }
  }
}
@container (min-width: 1300px) {
  .chant-form-item {
    width: 25%;
    &.textarea-box {
      width: 100%;
      .el-form-item {
        width: 50%;
      }
    }
  }
}
</style>
