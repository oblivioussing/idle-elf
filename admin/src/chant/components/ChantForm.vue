<template>
  <div class="chant-form">
    <el-form
      :label-width="props.labelWidth || '100px'"
      :model="vModel.form"
      ref="formRef">
      <el-form-item
        v-for="item in columnsList"
        :key="item.prop"
        class="chant-form-item"
        :label="translate(item) + ':'"
        :prop="item.prop">
        <!-- input -->
        <el-input
          v-if="formUtils.isInput(item)"
          v-model="vModel.form[item.prop]"
          :clearable="item.clearable !== false"
          :placeholder="translate(item, 'enter')">
        </el-input>
        <!-- select -->
        <el-select
          v-else-if="item.type === FormTypeEnum.Select"
          v-model="vModel.form[item.prop]"
          :clearable="item.clearable !== false"
          :placeholder="translate(item, 'select')"
          @change="onChange(item)">
          <el-option
            v-for="(val, key) in vModel?.dict![item.prop]"
            :label="val"
            :value="key">
          </el-option>
        </el-select>
        <!-- date,datetime -->
        <el-date-picker
          v-else-if="formUtils.isDate(item)"
          v-model="vModel.form[item.prop]"
          :disabled="isDisabled(item)"
          :placeholder="translate(item, 'select')"
          :type="columnType(item.type)"
          :value-format="item.valueFormat || 'x'">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { computed, ref } from 'vue'
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
  loading: boolean
  lang?: any
}
// props
const props = defineProps<{
  labelWidth?: string // label宽度
  modelValue: ModelValue // modelValue
  pageType?: PageTypeEnum // 页面类型
}>()
// emits
const emits = defineEmits(['update:modelValue'])
// use
const { t: tg } = useI18n({ useScope: 'global' })
const vModel = useVModel(props, 'modelValue', emits)
// ref
const formRef = ref<FormInstance>()
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
// type类型转化
function columnType(type?: FormTypeEnum) {
  return type as any
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
// change
function onChange(row: Column) {
  return row.change && row.change(vModel.value.form)
}
// 翻译
function translate(column: Column, type?: 'enter' | 'select') {
  const label = column.label || column.prop
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
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-select,
    .el-date-editor {
      width: 100%;
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
  }
}
@container (min-width: 1000px) {
  .chant-form-item {
    width: 33.3333%;
  }
}
@container (min-width: 1300px) {
  .chant-form-item {
    width: 25%;
  }
}
</style>
