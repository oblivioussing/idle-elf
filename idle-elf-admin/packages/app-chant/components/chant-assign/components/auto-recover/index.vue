<template>
  <chant-dialog
    v-model="state.visible"
    :loading="state.loading"
    :options="['close', 'save']"
    :title="t('title')"
    width="500px"
    @close="dialoger.close()"
    @save="onSave">
    <chant-form ref="formRef" v-model="state" in-dialog linefeed>
      <!-- 自动回收时间 -->
      <template #recoveryTime>
        <el-date-picker
          v-model="state.form.recoveryTime"
          type="date"
          value-format="x"
          :disabled-date="disabledDate"
          :placeholder="tg('tips.select') + t('recoveryTime')">
        </el-date-picker>
      </template>
    </chant-form>
  </chant-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { element } from '@chant/plugs'
import { useDialoger, useFormer } from '@chant/use'
import lang from './share/lang'
import model from './share/model'

// props
const props = defineProps<{
  modelValue: boolean // visible
}>()
// emit
const emits = defineEmits(['update:modelValue', 'update'])
// use
const dialoger = useDialoger()
const former = useFormer()
// i18n
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
// ref
const formRef = ref()
// state
const state = reactive({
  ...former.state,
  lang,
  model,
  visible: props.modelValue
})
// 日期禁用
function disabledDate(time: Date) {
  return time.getTime() <= new Date().getTime()
}
// 保存
async function onSave() {
  const status = await element.validate(formRef.value.formRef as any)
  if (status) {
    emits('update', state.form)
    emits('update:modelValue', false)
  }
}
</script>

<style scoped lang="scss"></style>
