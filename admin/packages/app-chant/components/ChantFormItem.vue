<template>
  <el-form-item
    class="chant-form-item"
    :class="{
      'line-feed': props.lineFeed || isLineFeed(props.type),
      'content-line-feed': props.contentLineFeed
    }"
    v-bind="$attrs"
    :prop="props.prop"
    :required="props.required"
    :rules="rules">
    <!-- label -->
    <template #label v-if="props.labelVisible">
      <el-tooltip
        :disabled="!props?.label || props.label.length < 8"
        :content="props.label"
        effect="dark"
        placement="top">
        <div class="ellipsis-1">
          <!-- label-slot -->
          <slot v-if="props.labelSlot" name="label-slot"></slot>
          <template v-else>
            {{ props.label }}{{ props.colon ? ':' : '' }}
          </template>
        </div>
      </el-tooltip>
    </template>
    <div class="content-box">
      <slot></slot>
      <!-- tips -->
      <div v-if="props.tips" class="tips">
        <el-tooltip effect="dark" :content="props.tips" placement="top">
          <i class="iconfont icon-ask m-l-5"></i>
        </el-tooltip>
      </div>
    </div>
    <!-- </div> -->
  </el-form-item>
  <br v-if="props.nextRow" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { FormType } from '../enum'

interface Props {
  contentLineFeed?: boolean
  colon?: boolean // 冒号
  label?: string
  labelSlot?: boolean
  labelVisible?: boolean // label是否显示
  lineFeed?: boolean
  nextRow?: boolean
  prop?: string
  required?: boolean
  row?: object
  tips?: string
  type?: FormType
}
// props
const props = withDefaults(defineProps<Props>(), {
  colon: true,
  labelVisible: true
})
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// rules
let rules: any
if (props.required) {
  rules = [
    {
      required: true,
      message: props.label + tg('tips.required')
    }
  ]
}
// form-item是否换行
function isLineFeed(type: FormType | undefined) {
  if (type) {
    return [
      FormType.Daterange,
      FormType.Datetimerange,
      FormType.Range,
      FormType.Textarea
    ].includes(type)
  }
}
</script>

<style lang="scss">
$input-width: 240px;

.chant-form-item {
  &.el-form-item {
    margin: 0 15px 17px 0;
  }
  // 换行
  &.line-feed {
    margin-right: 0;
    display: flex;
    width: auto;
    .el-input {
      width: 100%;
    }
    .el-textarea,
    .upload-inline {
      width: 624px;
    }
    .multiple-select {
      .el-input {
        width: 624px;
      }
    }
  }
  &.content-line-feed {
    .el-form-item__content {
      display: inline;
      .el-input {
        width: $input-width;
      }
    }
  }
  .content-box {
    display: flex;
    flex: 1;
    width: 100%;
  }
  .el-form-item__label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .el-form-item__content {
    width: $input-width;
  }
}
</style>
