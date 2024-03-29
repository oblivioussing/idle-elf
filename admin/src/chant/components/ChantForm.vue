<template>
  <div class="chant-form">
    <el-form
      :label-width="props.labelWidth || '80px'"
      :model="vModel.form"
      ref="formRef">
      <template v-for="item in availableColumns" :key="item.prop">
        <!-- divider -->
        <el-divider v-if="item.title" content-position="left">
          {{ translate(item) }}
        </el-divider>
        <!-- chant-form-item -->
        <div
          v-else
          class="chant-form-item"
          :class="{ 'whole-box': isWhole(item) }">
          <el-form-item
            :label="translate(item) + ':'"
            :prop="item.prop"
            :rules="rules(item)">
            <!-- input -->
            <el-input
              v-if="!item.type || item.type === 'input'"
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
              v-else-if="item.type === 'select'"
              v-model="vModel.form[item.prop]"
              :clearable="item.clearable !== false"
              :multiple="item.selectMultiple"
              :placeholder="translate(item, 'select')"
              @change="onChange(item)">
              <el-option
                v-for="(val, key) in props?.dict?.[item.prop]"
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
              v-else-if="item.type === 'time-picker'"
              v-model="vModel.form[item.prop]"
              :clearable="item.clearable !== false"
              :placeholder="translate(item, 'select')"
              :value-format="item.valueFormat || 'HH:mm:ss'">
            </el-time-picker>
            <!-- date-picker -->
            <template v-else-if="item.type === 'date-picker'">
              <el-date-picker
                v-if="formUtils.isDateRange(item.datepickerType)"
                v-model="state.range[item.prop]"
                :clearable="item.clearable !== false"
                :placeholder="translate(item, 'select')"
                :start-placeholder="translate(item)"
                :end-placeholder="translate(item)"
                :type="item.datepickerType"
                :value-format="item.valueFormat"
                @change="onDateRangeChange(item)">
              </el-date-picker>
              <el-date-picker
                v-else
                v-model="vModel.form[item.prop]"
                :clearable="item.clearable !== false"
                :placeholder="translate(item, 'select')"
                :type="item.datepickerType"
                :value-format="item.valueFormat">
              </el-date-picker>
            </template>
            <!-- input-number -->
            <el-input-number
              v-else-if="item.type === 'input-number'"
              v-model="vModel.form[item.prop]"
              controls-position="right"
              :min="item.min"
              :max="item.max"
              :placeholder="translate(item, 'enter')">
            </el-input-number>
            <!-- upload -->
            <chant-upload
              v-else-if="item.type === 'upload'"
              :limit="item.limit"
              :multiple="item.multiple"
              :type="item.uploadType">
            </chant-upload>
            <!-- range -->
            <div
              v-else-if="item.type === 'input-number-range'"
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
              v-else-if="item.type === 'radio'"
              v-model="vModel.form[item.prop]"
              :disabled="isDisabled(item)"
              :placeholder="translate(item, 'select')">
              <el-radio
                v-for="(val, key) in props.dict?.[item.prop]"
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'
import { formUtils, type FormColumn as Column, type Lang } from '@/chant'

// type
type ModelValue = {
  form: any
  formLoading: boolean
}
// props
const props = defineProps<{
  dict?: any // 字典
  labelWidth?: string // label宽度
  lang?: Lang // 国际化
  columns?: Column[] // model
  modelValue: ModelValue // modelValue
  pageType?: 'add' | 'edit' // 页面类型
}>()
// emits
const emits = defineEmits(['instance', 'update:modelValue'])
// use
const { t: tg } = useI18n({ useScope: 'global' })
const { t } = useI18n({ messages: props.lang })
const vModel = useVModel(props, 'modelValue', emits)
// ref
const formRef = ref<FormInstance>()
// state
const state = reactive({
  range: {} as any
})
// computed
const availableColumns = computed(() => {
  return props.columns?.filter((item) => {
    if (item.hide) {
      return false
    }
    if (item.hideInPages?.includes(props.pageType!)) {
      return false
    }
    if (item.showCustom) {
      return item?.showCustom(vModel.value)
    }
    return true
  })
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
  props.columns?.forEach((item) => {
    // date range
    if (formUtils.isDateRange(item.datepickerType)) {
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
// daterange赋值
function dateRangeVoluation(column: Column) {
  const start = rangeField(column, 'start')
  const end = rangeField(column, 'end')
  const startTime = vModel.value.form[start]
  const endTime = vModel.value.form[end]
  if (startTime && endTime) {
    state.range[column.prop] = [startTime, endTime]
  }
  if (!startTime && !endTime) {
    state.range[column.prop] = [null, null]
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
// 是否显示一整行
function isWhole(column: Column) {
  if (column.type === 'upload') {
    return true
  }
  if (column.inputType === 'textarea') {
    return true
  }
}
// range field
function rangeField(column: Column, type: 'start' | 'end') {
  const suffix = type.replace(/^\S/, (s) => s.toUpperCase())
  if (column.dynamicStart || column.dynamicEnd) {
    const key = `dynamic${suffix}` as 'dynamicStart' | 'dynamicEnd'
    return column[key]!
  }
  return `${column.prop}${suffix}`
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
// change
function onChange(column: Column) {
  return column.change && column.change(vModel.value.form)
}
// 日期范围选择
function onDateRangeChange(column: Column) {
  let value = state.range[column.prop]
  if (!value) {
    value = ['', '']
  }
  vModel.value.form[rangeField(column, 'start')] = value[0]
  vModel.value.form[rangeField(column, 'end')] = value[1]
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
  return tips + t(label)
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
    &.whole-box {
      width: 100%;
    }
  }
}
@container (min-width: 1000px) {
  .chant-form-item {
    width: 33.3333%;
    &.whole-box {
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
    &.whole-box {
      width: 100%;
      .el-form-item {
        width: 50%;
      }
    }
  }
}
</style>
