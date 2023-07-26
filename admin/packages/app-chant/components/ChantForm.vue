<template>
  <div
    v-loading="props.modelValue?.formLoading"
    class="chant-form"
    :class="{ nest: props.nest, 'wrap-full': props.wrapFull }">
    <div
      class="chant-form-split"
      :style="{ flex: props.heightFull ? 1 : 'none' }">
      <slot name="left"></slot>
      <div
        :class="{
          'dialog-form-container': props.inDialog,
          'chant-form-container': !props.inDialog,
          'two-columns-form-container': props.twoColumns,
          'form-linefeed': props.linefeed,
          'form-readonly': props.readonly
        }">
        <el-form
          ref="formRef"
          :model="formVModel"
          :rules="rules"
          :inline="true"
          :label-width="props.labelWidth || '110px'"
          :disabled="props.disabled"
          :size="props.size">
          <template v-for="item in state.columns">
            <!-- divider -->
            <el-divider
              v-if="item.type === FormType.Divider && showFormItem(item)"
              content-position="left">
              {{ translate(item.label as string) }}
            </el-divider>
            <!-- item-slot -->
            <slot
              v-else-if="item.itemSlot"
              :name="item.prop"
              :value="formVModel[item.prop]"
              :label="translate(item.label as string)"
              :row="item">
            </slot>
            <!-- sys-tenant -->
            <chant-sys-tenant
              v-else-if="item.type === FormType.SysTenant"
              v-model="formVModel"
              :alter-tenant="props.alterTenant"
              :readonly="props.readonly"
              :tenant-classify="item.tenantClassify"
              type="form">
            </chant-sys-tenant>
            <!-- form-item -->
            <chant-form-item
              v-else-if="showFormItem(item)"
              :content-line-feed="item.contentLineFeed"
              :label="translate(item.label as string)"
              :label-slot="item.labelSlot"
              :line-feed="item.lineFeed"
              :next-row="item.nextRow"
              :prop="item.prop"
              :row="item"
              :tips="item.tips"
              :type="item.type">
              <!-- label-slot -->
              <template v-if="item.labelSlot" #label-slot>
                <slot :name="item.prop + '-label'" :row="item"></slot>
              </template>
              <!-- slot -->
              <slot
                v-if="item.slot"
                :name="item.prop"
                :value="formVModel[item.prop]"
                :label="translate(item.label as string)"
                :row="(item as any)">
              </slot>
              <!-- readonly -->
              <div
                v-else-if="props.readonly || item.readonly"
                class="form-item-text">
                {{ showText(item) }}
              </div>
              <!-- input -->
              <chant-input
                v-else-if="isInput(item)"
                v-model="formVModel[item.prop]"
                v-bind="item.attr"
                :disabled="isDisabled(item)"
                :min="item.min"
                :max="item.max"
                :placeholder="translate(item.label as string, 'enter')"
                :style="{ width: item.width }"
                :text-type="item.textType"
                :tip="false"
                :type="item?.attr?.type">
                <template
                  v-if="item.prepend && formVModel[item.prepend]"
                  #prepend>
                  {{ formVModel[item.prepend as string] }}
                </template>
                <template v-else-if="item.prependLabel" #prepend>
                  {{ translate(item.prependLabel as string) }}
                </template>
                <template
                  v-else-if="item.append && formVModel[item.append]"
                  #append>
                  {{ formVModel[item.append as string] }}
                </template>
                <template v-else-if="item.appendLabel" #append>
                  {{ translate(item.appendLabel as string) }}
                </template>
              </chant-input>
              <!-- inputnumber -->
              <el-input-number
                v-else-if="item.type === FormType.InputNumber"
                v-model="formVModel[item.prop]"
                controls-position="right"
                :min="item.min || 0"
                :max="item.max">
              </el-input-number>
              <!-- timeselect -->
              <el-time-select
                v-else-if="item.type === FormType.TimeSelect"
                :placeholder="translate(item.label as string, 'select')"
                :clearable="item?.attr?.clearable !== false"
                v-model="formVModel[item.prop]"
                :start="item?.attr?.start"
                :step="item?.attr?.step"
                :end="item?.attr?.end"
                @change="onChange(item)">
              </el-time-select>
              <!-- timepicker -->
              <el-time-picker
                v-else-if="item.type === FormType.TimePicker"
                :placeholder="translate(item.label as string, 'select')"
                :clearable="item?.attr?.clearable !== false"
                :value-format="item.valueFormat || 'HH:mm:ss'"
                v-model="formVModel[item.prop]">
              </el-time-picker>
              <!-- date,datetime -->
              <el-date-picker
                v-else-if="isDate(item)"
                v-model="formVModel[item.prop]"
                :type="(item.type as any)"
                :value-format="item.valueFormat || 'x'"
                :disabled="isDisabled(item)"
                :placeholder="translate(item.label as string, 'select')">
              </el-date-picker>
              <!-- daterange,datetimerange -->
              <el-date-picker
                v-else-if="isDateRange(item)"
                v-model="state.dateRange[item.prop]"
                :type="(item.type as any)"
                :value-format="item.valueFormat || 'x'"
                :disabled="isDisabled(item)"
                :start-placeholder="translate(item.label as string, 'select')"
                :end-placeholder="translate(item.label as string, 'select')"
                @change="onDateRange(item)">
              </el-date-picker>
              <!-- range -->
              <div v-else-if="item.type === FormType.Range" class="input-range">
                <el-input
                  v-model="formVModel[item.start as string]"
                  :placeholder="translate(item.label as string, 'enter')">
                </el-input>
                <div class="connector">~</div>
                <el-input
                  v-model="formVModel[item.end as string]"
                  :placeholder="translate(item.label as string, 'enter')">
                </el-input>
              </div>
              <!-- radio -->
              <el-radio-group
                v-else-if="item.type === FormType.Radio"
                v-model="formVModel[item.prop]"
                :disabled="isDisabled(item)"
                :placeholder="translate(item.label as string, 'select')">
                <el-radio
                  v-for="(val, key) in dictCpd?.[item.prop]"
                  :label="key">
                  {{ val }}
                </el-radio>
              </el-radio-group>
              <!-- select -->
              <el-select
                v-else-if="isSelect(item)"
                v-model="formVModel[item.prop]"
                :disabled="isDisabled(item)"
                :placeholder="translate(item.label as string, 'select')"
                :clearable="item?.attr?.clearable !== false"
                :multiple="item.type === FormType.SelectMultiple"
                :class="{
                  'multiple-select': item.type === FormType.SelectMultiple
                }"
                @change="onChange(item)">
                <el-option
                  v-for="(val, key) in dictCpd?.[item.prop]"
                  :label="val"
                  :value="key"
                  :disabled="item.disabledOption?.includes(key as any)">
                </el-option>
              </el-select>
              <!-- tenant-picker -->
              <chant-tenant-picker
                v-else-if="item.type === FormType.TenantPicker"
                v-model:id="
                  formVModel[item.dynamicId || item.prop || 'tenantId']
                "
                v-model:name="formVModel[item.dynamicName || 'tenantName']"
                :disabled="isDisabled(item)"
                :tenant-classify="item.tenantClassify"
                :tenant-placeholder="
                  translate(item.tenantPlaceholder || item.label!)
                ">
              </chant-tenant-picker>
              <!-- user-picker -->
              <chant-user-picker
                v-else-if="item.type === FormType.UserPicker"
                v-model:id="
                  formVModel[item.dynamicId || item.prop || 'userInfoId']
                "
                v-model:name="formVModel[item.dynamicName || 'userInfoName']"
                :api-url="item.apiUrl"
                :sys-code="formVModel.sysCode"
                :tenant-id="formVModel.tenantId"
                :placeholder="translate(item.label || '')">
              </chant-user-picker>
              <!-- speech-picker -->
              <chant-speech-picker
                v-else-if="item.type === FormType.SpeechPicker"
                v-model:id="
                  formVModel[item.dynamicId || item.prop || 'speechId']
                "
                v-model:code="formVModel[item.dynamicCode || 'speechCode']"
                v-model:name="formVModel[item.dynamicName || 'speechName']"
                :disabled="isDisabled(item)"
                :api-url="item.apiUrl"
                :sys-code="formVModel.sysCode"
                :tenant-id="formVModel.tenantId"
                :placeholder="translate(item.label || '')"
                @change="onChange(item)">
              </chant-speech-picker>
              <!-- textarea -->
              <el-input
                v-else-if="item.type === FormType.Textarea"
                v-model="formVModel[item.prop]"
                :placeholder="translate(item?.label as string, 'enter')"
                :disabled="isDisabled(item)"
                v-bind="item.attr"
                type="textarea"
                clearable
                :style="{ width: item.width }">
              </el-input>
            </chant-form-item>
            <!-- nextRow -->
            <br v-else-if="item.nextRow" />
          </template>
          <slot></slot>
        </el-form>
      </div>
      <div v-if="props.fold">
        <!-- 展开 -->
        <chant-icon-button
          v-if="state.arrow === 'down'"
          :content="tg('button.spread')"
          :icon="ArrowDown"
          type="primary"
          @click="onCollapse('up')">
        </chant-icon-button>
        <!-- 关闭 -->
        <chant-icon-button
          v-if="state.arrow === 'up'"
          :content="tg('button.fold')"
          :icon="ArrowUp"
          type="primary"
          @click="onCollapse('down')">
        </chant-icon-button>
      </div>
      <slot name="right"></slot>
    </div>
    <slot name="outside"></slot>
    <!-- footer -->
    <div
      v-if="!props.inDialog && !props.nest && props.showFooter"
      class="toolbar chant-form-footer">
      <el-button v-if="props.showClose" @click="base.closePage()">
        {{ tg('button.close') }}
      </el-button>
      <slot name="footer"></slot>
      <el-button
        v-if="props.type !== 'detail'"
        :loading="props.modelValue?.loading"
        type="primary"
        @click="onSave">
        {{ tg('button.save') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ElForm } from 'element-plus'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import { FormType, PageEnum } from '../enum'
import { base, core, format } from '../share'
import { element, vuei18n } from '../plugs'
import { FormColumn as Column } from '../type'
import ChantInput from './ChantInput.vue'
import ChantSysTenant from './ChantSysTenant.vue'
import ChantUserPicker from './chant-user-picker/index.vue'
import ChantSpeechPicker from './chant-speech-picker/index.vue'

type FormInstance = InstanceType<typeof ElForm>
type PageType = 'add' | 'detail' | 'edit'

type ModelValue = {
  dict?: Record<string, any>
  form?: any
  formLoading?: boolean
  model?: Column[]
  loading?: boolean
  lang?: any
}
interface Props {
  alterTenant?: boolean // 是否可以修改租户
  dict?: Record<string, any> // dict
  disabled?: boolean // 禁用
  disabledColumns?: string[] // 禁用的字段
  heightFull?: boolean // 高度是否撑满
  fold?: boolean // 折叠
  form?: any // form
  inDialog?: boolean // 是否处于dialog中
  linefeed?: boolean // 换行
  labelWidth?: string // label宽度
  lang?: any // lang
  modelValue?: ModelValue
  model?: Column[] // model
  nest?: boolean // form内部嵌套
  nestRefs?: Ref[] // 嵌套ref
  readonly?: boolean // 只读
  rules?: object // 校验规则
  showClose?: boolean // 显示关闭按钮
  showFooter?: boolean // 显示底部
  size?: 'large' | 'default' | 'small' // size
  type?: PageType // 表单类型
  twoColumns?: boolean // 显示两列
  wrapFull?: boolean // 表单最外层是否撑满
}
// props
const props = withDefaults(defineProps<Props>(), {
  alterTenant: false, // 是否可以修改租户-否
  fold: false, // 折叠
  heightFull: true, // 高度是否撑满-是
  showClose: true, // 显示关闭按钮
  showFooter: true, // 显示底部
  wrapFull: true // 表单最外层是否撑满-是
})
// emit
const emit = defineEmits([
  'update:modelValue',
  'update:form',
  'before-save',
  'close',
  'save',
  'change'
])
// VModel
const formVModel = useVModel(
  props?.form ? props : props?.modelValue || {},
  'form',
  emit
)
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// ref
const formRef = ref<FormInstance>()
// state
const state = reactive({
  arrow: 'up' as 'up' | 'down',
  columns: [] as Column[],
  dateRange: {} as any
})
const rules: Record<string, any> = reactive({
  ...props.rules
})
// defineExpose
defineExpose({
  formRef,
  validate // form校验方法
})
// watch
watch([() => props.modelValue?.model, () => props.model], () => {
  // 创建columns
  createColumns()
})
watch(
  [() => props.modelValue?.lang, () => props.lang],
  () => {
    // 创建columns
    createColumns()
  },
  { deep: true }
)
// computed
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = props.lang || props.modelValue?.lang
  if (lang) {
    return lang[locale]
  } else {
    return {}
  }
})
const dictCpd = computed(() => {
  return props.dict || props.modelValue?.dict
})
// 创建columns
createColumns()
function createColumns() {
  // 是否为pta
  const isPta = core.isPta()
  const model = props.model || props.modelValue?.model
  state.columns = model?.filter((item) => {
    item.label = item.label || item.prop
    // defaultValue
    if (item.defaultValue && base.isEmpty(formVModel.value[item.prop])) {
      formVModel.value[item.prop] = item.defaultValue
    }
    // required
    if (item.required && !props.readonly) {
      const rule = {
        required: true,
        message: translate(item.label) + tg('tips.required')
      }
      rules[item.prop] = [rule]
    }
    // rules
    if (item.rules) {
      rules[item.prop] = item.rules
    }
    // SelectMultiple
    if (item.type === FormType.SelectMultiple) {
      formVModel.value[item.prop] = []
    }
    // range
    if (isRange(item)) {
      item.start = item.start || `${item.prop}Start`
      item.end = item.end || `${item.prop}End`
      // daterange赋值
      dateRangeVoluation(item)
      // watch
      watch(
        () => formVModel.value[item.start as string],
        () => {
          // daterange赋值
          dateRangeVoluation(item)
        }
      )
    }
    // hideInPage
    if (props.type) {
      const hide = item.hideInPage?.includes(props?.type as PageEnum)
      return !hide
    }
    // pta不显示tenantPicker
    if (isPta && !item.ignorePta && item.type === FormType.TenantPicker) {
      return false
    }
    return true
  }) as Column[]
}
// 展开/关闭
function onCollapse(type: 'down' | 'up') {
  state.arrow = type
  const el = formRef.value?.$el
  if (type === 'up') {
    el.style.height = 'auto'
    const height = el.offsetHeight
    el.style.height = '24px'
    setTimeout(() => {
      el.style.height = height + 'px'
    }, 0)
  } else {
    el.style.height = '24px'
    el.style.overflow = 'hidden'
  }
}
// daterange赋值
function dateRangeVoluation(row: Column) {
  const startTime = formVModel.value[row.start as string]
  const endTime = formVModel.value[row.end as string]
  if (startTime && endTime) {
    state.dateRange[row.prop] = [startTime, endTime]
  }
}
// 是否显示form-item
function showFormItem(row: Column) {
  if (row.showCustom) {
    return row?.showCustom(formVModel.value)
  }
  if (row.hideCustom) {
    return !row?.hideCustom(formVModel.value)
  }
  return true
}
// 是否为range
function isRange(row: Column) {
  const list = [FormType.Range, FormType.Daterange, FormType.Datetimerange]
  if (row.type) {
    return list.includes(row.type)
  }
}
// 是否禁用
function isDisabled(row: Column) {
  if (typeof row.disabled === 'function') {
    return row.disabled(formVModel.value)
  }
  if (props.type === 'detail') {
    return true
  }
  if (row.disabledInPage && row.disabledInPage === props.type) {
    return true
  }
  const index = props.disabledColumns?.findIndex((item) => {
    return row.prop === item
  })
  if (index && index >= 0) {
    return true
  }
  return row.disabled
}
// 显示纯文本
function showText(row: Column) {
  let value = formVModel.value[row.prop]
  const dict = dictCpd.value?.[row.prop] || {}
  // select-multiple
  if (row.type === FormType.SelectMultiple) {
    if (value?.length) {
      return (value as string[]).map((item) => dict![item]).toString()
    } else {
      return '-'
    }
  }
  // 是否为字典
  if (isDict(row.type)) {
    return dict?.[value] || '-'
  }
  // 是否为date
  if (row.type === FormType.Date) {
    return value ? format.date(value) : '-'
  }
  // 是否为datetime
  if (row.type === FormType.DateTime) {
    return value ? format.dateTime(value) : '-'
  }
  // 是否为range
  if (isRange(row)) {
    const start = formVModel.value[row.start!]
    const end = formVModel.value[row.end!]
    if (!start || !end) {
      return '-'
    }
    // range
    if (row.type === FormType.Range) {
      return `${start} - ${end}`
    }
    // daterange
    if (row.type === FormType.Daterange) {
      return `${format.date(start)} - ${format.date(end)}`
    }
    // datetimerange
    if (row.type === FormType.Datetimerange) {
      return `${format.dateTime(start)} - ${format.dateTime(end)}`
    }
  }
  // -
  value = value || '-'
  // prepend,append
  let { prepend, prependLabel, append, appendLabel } = row
  if (prepend) {
    prepend = formVModel.value[prepend] || ''
    return prepend + value
  }
  if (prependLabel) {
    if (prependLabel.indexOf('.') >= 0) {
      appendLabel = tg(prependLabel)
    } else {
      prependLabel = messages.value[prependLabel] || ''
    }
    return prependLabel + value
  }
  if (append) {
    append = formVModel.value[append] || ''
    return value + append
  }
  if (appendLabel) {
    if (appendLabel.indexOf('.') >= 0) {
      appendLabel = tg(appendLabel)
    } else {
      appendLabel = messages.value[appendLabel] || ''
    }
    return value + appendLabel
  }
  return value
}
// 是否为字典
function isDict(type?: FormType) {
  if (type) {
    return [FormType.Radio, FormType.Select].includes(type)
  }
}
// 是否为input
function isInput(row: Column) {
  if (row.type === FormType.Input) {
    return true
  }
  return !row.type && !row.slot
}
// 是否为date
function isDate(row: Column) {
  if (row.type) {
    return [FormType.Date, FormType.DateTime].includes(row.type)
  }
}
// 是否为daterange
function isDateRange(row: Column) {
  if (row.type) {
    return [FormType.Daterange, FormType.Datetimerange].includes(row.type)
  }
}
// 是否为select
function isSelect(row: Column) {
  if (row.type) {
    return [FormType.Select, FormType.SelectMultiple].includes(row.type)
  }
}
// 日期范围选择
function onDateRange(row: Column) {
  const prop = row.prop
  let value = state.dateRange[prop]
  if (!value) {
    value = ['', '']
  }
  formVModel.value[row.start as string] = value[0]
  formVModel.value[row.end as string] = value[1]
}
// change
function onChange(row: Column) {
  if (row.change) {
    return row?.change(formVModel)
  }
}
// form校验方法
async function validate() {
  return await element.validate(formRef.value as any)
}
// 保存
async function onSave() {
  emit('before-save')
  let status = await validate()
  let list = [status]
  const nestRefs = props.nestRefs || []
  // 校验内部表单
  for (let i = 0; i < nestRefs.length; i++) {
    const nestRef = nestRefs[i] as any
    if (nestRef) {
      status = (await nestRef?.validate()) || false
      list.push(status)
    }
  }
  const hasFalse = list.some((item) => item === false)
  !hasFalse && emit('save')
}
// 翻译
function translate(label: string, type?: 'enter' | 'select') {
  if (label.indexOf('.') >= 0) {
    label = tg(label)
  } else {
    label = messages.value[label]
  }
  if (type === 'enter') {
    return tg('tips.enter') + (label || '')
  }
  if (type === 'select') {
    return tg('tips.select') + (label || '')
  }
  return label || ''
}
</script>

<style lang="scss">
@import '../style/mixin.scss';
@import '../style/var.scss';

$input-width: 240px;

.chant-form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 10px;
  overflow: hidden;
  // 表单最外层撑满
  &.wrap-full {
    flex: 1;
  }
  // 表单嵌套
  &.nest {
    display: inline;
    .chant-form-container {
      display: inline;
      .el-form {
        display: inline;
      }
    }
  }
  .chant-form-split {
    display: flex;
    overflow: hidden;
    .form-split-item {
      margin-top: 5px;
    }
  }
  .chant-form-container {
    @include scroll-beautify;
    flex: 1;
    .el-input-number,
    .el-input,
    .el-select {
      width: 100%;
    }
    // date
    .el-date-editor.el-input {
      width: $input-width;
    }
    .el-date-editor--datetimerange {
      max-width: 330px;
    }
    .el-date-editor--timerange {
      max-width: $input-width;
    }
    // form-item
    .el-form-item {
      align-items: flex-start;
      vertical-align: baseline;
    }
  }
  // 只读表单
  .form-readonly {
    .el-form-item {
      margin: 0 0 5px 0 !important;
    }
  }
  .chant-form-footer {
    display: flex;
    justify-content: flex-end;
  }
  .dialog-form-container,
  .two-columns-form-container {
    width: 100%;
    .el-form {
      display: flex;
      flex-wrap: wrap;
    }
    &.form-linefeed {
      .el-form-item {
        width: 100%;
      }
    }
    .el-form-item {
      box-sizing: border-box;
      display: flex;
      align-items: flex-start;
      margin: 0 0 17px 0 !important;
      width: 50%;
      &.line-feed {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
  .input-range {
    display: flex;
    align-items: center;
    .connector {
      text-align: center;
      width: 32px;
    }
  }
  .el-input {
    .el-input-group__append,
    .el-input-group__prepend {
      padding: 0 6px;
    }
  }
  .form-item-text {
    color: $color-black2;
  }
}
</style>
