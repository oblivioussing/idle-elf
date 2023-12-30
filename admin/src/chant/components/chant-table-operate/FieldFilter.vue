<template>
  <div class="field-filter">
    <chant-button
      :content="t('filter')"
      :icon="Document"
      type="primary"
      @click.stop="onShowFilter">
    </chant-button>
    <div v-show="state.visible" class="fly-box" @click.stop>
      <div class="bubble"></div>
      <draggable
        v-bind="{ animation: 200 }"
        class="container"
        item-key="prop"
        :list="vModel.columns">
        <template #item="{ element }">
          <div v-if="element.prop !== 'operate'" class="item">
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
      <!-- 保存 -->
      <div class="save-box">
        <el-button type="primary" @click="onSave">{{
          tg('button.save')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'
import { Document, Sort } from '@element-plus/icons-vue'
import { useVModel } from '@vueuse/core'
import { type ListColumn as Column, type ListState } from '@/chant'
import { StorageEnum } from '@/enum'
import { vuei18n } from '@/plugs'
import { storage } from '@/utils'

// props
const props = defineProps<{
  lang?: any // 国际化
  modelValue: ListState
}>()
// emits
const emits = defineEmits(['update:modelValue'])
// use
const { t: tg } = useI18n({ useScope: 'global' })
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
const route = useRoute()
const vModel = useVModel(props, 'modelValue', emits)
// state
const state = reactive({
  visible: false
})
// computed
const messages = computed(() => {
  const locale = vuei18n.global.locale.value
  const lang = props.lang
  return lang ? lang[locale] : {}
})
// 空白处点击
document.addEventListener('click', () => {
  state.visible = false
})
// init
filterStorageFiled() // 过滤缓存的字段
// 过滤缓存的字段
function filterStorageFiled() {
  const obj = storage.getLocal(StorageEnum.TableFilter)
  const list = obj?.[route.path] as string[]
  list?.forEach((item: string) => {
    const row = vModel.value.columns.find((column) => column.prop === item)
    if (row) {
      row.hide = true
    }
  })
}
// 显示字段过滤
function onShowFilter() {
  state.visible = !state.visible
}
// change
function onChange(val: any, column: Column) {
  column.hide = !val
}
// 保存
function onSave() {
  let columns = vModel.value.columns.filter((item) => {
    return item.hide
  })
  const list = columns.map((item) => item.prop)
  storage.setLocal(StorageEnum.TableFilter, { [route.path]: list })
  state.visible = false
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
.field-filter {
  margin-left: 10px;
  position: relative;
  .fly-box {
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
  .save-box {
    padding-right: 10px;
    text-align: right;
    :deep(.el-button) {
      height: 24px;
    }
  }
}
</style>
