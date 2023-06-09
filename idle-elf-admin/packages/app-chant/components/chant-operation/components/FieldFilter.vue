<template>
  <div class="m-l-10 rel">
    <span @click.stop="onShowFilter">
      <chant-icon-button
        :content="tg('button.filter')"
        :icon="Document"
        type="primary">
      </chant-icon-button>
    </span>

    <div v-show="state.filterVisible" class="filter">
      <div class="bubble"></div>
      <draggable
        :list="vModel"
        v-bind="{ animation: 200 }"
        item-key="prop"
        class="container">
        <template #item="{ element }">
          <div @click.stop class="item">
            <el-icon class="handle">
              <Sort></Sort>
            </el-icon>
            <el-checkbox
              v-model="element.show"
              :label="false"
              :checked="!element.hide">
              {{ translate(element) }}
            </el-checkbox>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Document, Sort } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import { useVModel } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { vuei18n } from '../../../plugs'
import { ListColumn } from '../../../type'

type Column = ListColumn & {
  show?: boolean
}
// props
const props = defineProps<{
  modelValue: Column[]
  messages?: any
}>()
// emit
const emit = defineEmits(['update:modelValue'])
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// VModel
const vModel = useVModel(props, 'modelValue', emit)
// state
const state = reactive({
  filterVisible: false
})
// 空白处点击
document.addEventListener('click', () => {
  state.filterVisible = false
})
// watch
watch(vModel.value, () => {
  vModel.value.forEach((item) => {
    item.hide = !item.show
  })
})
// computed
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = props.messages
  if (lang) {
    return lang[locale]
  } else {
    return {}
  }
})
// 显示字段过滤
function onShowFilter() {
  state.filterVisible = !state.filterVisible
}
// 翻译
function translate(row: Column) {
  const label = row.label || row.prop
  if (label.indexOf('common.') >= 0) {
    return tg(label)
  }
  return messages.value[label]
}
</script>

<style scoped lang="scss">
@import '../../../style/mixin.scss';
@import '../../../style/var.scss';

.filter {
  background-color: $color-white;
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
    border-bottom: 10px solid $color-white;
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
      background-color: $color-white;
      content: '';
      position: absolute;
      top: 10px;
      left: -10px;
      height: 10px;
      width: 20px;
    }
  }
  .container {
    @include scroll-beautify;
    max-height: 350px;
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
