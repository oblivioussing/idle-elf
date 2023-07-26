<template>
  <el-dialog
    v-model="state.visible"
    :title="props.title"
    :width="props.width || 740"
    :before-close="onClose"
    :custom-class="isPicker() ? 'picker' : ''"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-bind="$attrs">
    <div
      :class="{
        'dialog-form': props.type === 'form',
        'dialog-scroll-form': props.type === 'scrollForm',
        'dialog-picker': props.type === 'picker',
        'dialog-scroll-picker': props.type === 'scrollPicker'
      }"
      :style="{ height: props.containerHeight }">
      <slot></slot>
    </div>
    <template #footer>
      <div v-if="props.options?.length" class="dialog-footer">
        <!-- 关闭 -->
        <el-button v-if="show('close')" @click="onClose">
          {{ t('button.close') }}
        </el-button>
        <slot name="footer"></slot>
        <!-- 暂存 -->
        <el-button
          v-if="show('stash')"
          :loading="props.loading"
          type="primary"
          @click="onStash">
          {{ t('button.temporarySave') }}
        </el-button>
        <!-- 保存 -->
        <el-button
          v-if="show('save')"
          :loading="props.loading"
          type="primary"
          @click="onSave">
          {{ props.saveButtonText || t('button.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type Option = 'close' | 'stash' | 'save'

// props
const props = defineProps<{
  containerHeight?: string
  modelValue?: boolean
  loading?: boolean
  options?: Option[]
  title?: string
  type?: 'form' | 'picker' | 'scrollForm' | 'scrollPicker' | undefined
  width?: string
  saveButtonText?: string
}>()
// emit
const emit = defineEmits(['update:modelValue', 'close', 'stash', 'save'])
// i18n
const { t } = useI18n({ useScope: 'global' })
// state
const state = reactive({
  visible: props.modelValue || false
})
// watch
watch(
  () => props.modelValue,
  () => {
    state.visible = props.modelValue || false
  }
)
// 显示按钮
function show(type: Option) {
  return props.options?.includes(type)
}
// 是否为picker
function isPicker() {
  return props.type
}
// 关闭
function onClose() {
  state.visible = false
  emit('update:modelValue', false)
  emit('close')
}
// 暂存
function onStash() {
  emit('stash')
}
// 保存
function onSave() {
  emit('save')
}
</script>

<style lang="scss">
@import '../style/mixin.scss';
.dialog-form {
  @include flex-column;
  height: 75vh;
}
.dialog-scroll-form {
  @include scroll-beautify;
  margin-bottom: 10px;
  max-height: 75vh;
}
.dialog-picker {
  @include flex-column;
  padding-bottom: 10px;
  height: 80vh;
}
.dialog-scroll-picker {
  @include scroll-beautify;
  margin-bottom: 10px;
  height: 80vh;
}
.dialog-footer {
  padding: 0 20px 15px 10px;
}
</style>
