<template>
  <div class="m-l-10 rel">
    <chant-button
      :content="t('filter')"
      :icon="Document"
      type="primary"
      @click.stop="onShowFilter">
    </chant-button>
    <div v-show="state.visible" class="filter" @click.stop>
      <div class="bubble"></div>
      <draggable
        v-bind="{ animation: 200 }"
        class="container"
        item-key="prop"
        :list="vModel.columns">
        <template #item="{ element }">
          <div class="item">
            <el-icon class="handle">
              <Sort></Sort>
            </el-icon>
            <el-checkbox
              :checked="!element.hide"
              @change="onChange($event, element)">
              {{ translate(element) }}
            </el-checkbox>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import { Document, Sort } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import { vuei18n } from '@/plugs'
import { type ListColumn as Column, type ListState } from '@/type'

// props
const props = defineProps<{
  modelValue: ListState
}>()
// emits
const emits = defineEmits(['update:modelValue'])
// i18n
const { t } = useI18n({
  messages: {
    en: {
      filter: 'filter'
    },
    zh: {
      filter: '过滤'
    }
  }
})
// VModel
const vModel = useVModel(props, 'modelValue', emits)
// state
const state = reactive({
  visible: false
})
// computed
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = vModel.value.lang
  return lang ? lang[locale] : {}
})
// 空白处点击
document.addEventListener('click', () => {
  state.visible = false
})
// 显示字段过滤
function onShowFilter() {
  state.visible = !state.visible
}
// checkbox change
function onChange(val: any, column: Column) {
  column.hide = !val
}
// 翻译
function translate(column: Column) {
  let label = column.label || column.prop
  var pattern = new RegExp('[\u4E00-\u9FA5]+')
  if (pattern.test(label)) {
    return label
  }
  return messages.value[label]
}
</script>

<style scoped lang="scss">
.filter {
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  padding: 5px 0;
  position: absolute;
  top: 45px;
  right: -10px;
  z-index: 9;
  .bubble {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #ffffff;
    position: absolute;
    top: -10px;
    right: 15px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      border-left: 11px solid transparent;
      border-right: 11px solid transparent;
      border-bottom: 11px solid rgba(0, 0, 0, 0.2);
      position: absolute;
      top: -1px;
      left: -11px;
      z-index: -1;
      filter: blur(2px);
    }
    &::after {
      background-color: #ffffff;
      content: '';
      position: absolute;
      top: 10px;
      left: -10px;
      height: 10px;
      width: 20px;
    }
  }
  .container {
    max-height: 350px;
    overflow: auto;
  }
  .item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 10px;
    white-space: nowrap;
    .handle {
      cursor: move;
      margin-right: 10px;
    }
  }
}
</style>
