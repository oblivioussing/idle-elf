<template>
  <chant-dialog v-model="vModel" title="批量修改">
    <chant-form
      v-model="state"
      :dict="dict"
      :lang="lang"
      :model="model"
      @instance="former.bindInstance">
    </chant-form>
    <template #footer>
      <!-- 关闭 -->
      <el-button @click="vModel = false">{{ tg('button.close') }}</el-button>
      <!-- 保存 -->
      <el-button type="primary" @click="onSave">
        {{ tg('button.save') }}
      </el-button>
    </template>
  </chant-dialog>
</template>

<script setup lang="ts" name="user-user-list-add">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'
import { useFormer } from '@/use'
import { dict, lang, model } from '../share'

// props
const props = defineProps<{
  modelValue: boolean
}>()
// emits
const emits = defineEmits(['update', 'update:modelValue'])
// use
const { t: tg } = useI18n({ useScope: 'global' })
const former = useFormer({ type: 'dialog' })
const vModel = useVModel(props, 'modelValue', emits)
// state
const state = reactive({
  ...former.state
})
// 保存
function onSave() {
  former.save('xx/xxx', state)
}
</script>

<style scoped lang="scss"></style>
