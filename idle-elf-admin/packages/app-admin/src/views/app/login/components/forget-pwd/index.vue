<template>
  <chant-dialog
    :title="t('forgetPwdTitle')"
    v-model="state.visible"
    :loading="state.loading"
    :options="state.active === '1' ? ['close', 'save'] : ['close']"
    @close="dialoger.close()"
    @save="onSave"
    append-to-body
    width="640px">
    <el-tabs v-model="state.active" type="card">
      <el-tab-pane :label="t('admin')" name="1">
        <chant-form
          linefeed
          ref="formRef"
          label-width="90px"
          :rules="rules"
          v-model="state"
          in-dialog>
        </chant-form>
      </el-tab-pane>
      <el-tab-pane :label="t('otherUser')" name="2">
        <el-empty image-size="100" :description="t('description')" />
      </el-tab-pane>
    </el-tabs>
  </chant-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// @ts-ignore
import md5 from 'js-md5'
import { element, shiki, useDialoger, useFormer, Api } from 'chant'
import { model, lang } from './share'

// props
const props = defineProps<{
  modelValue: boolean
}>()
// emit
const emit = defineEmits(['update:modelValue'])
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
  visible: props.modelValue,
  model,
  lang,
  active: '1'
})
const rules = reactive({
  signature: [
    { required: true, message: `${t('signature')}${tg('tips.required')}` }
  ],
  password: [
    { required: true, message: `${t('password')}${tg('tips.required')}` }
  ],
  confirmPassword: [
    { required: true, message: `${t('confirmPassword')}${tg('tips.required')}` }
  ]
})
// created
former.created(() => {}, state)
// 保存
async function onSave() {
  const status = await element.validate(formRef.value.formRef)
  if (status) {
    state.loading = true
    const params = {
      signature: state.form.signature,
      password: md5(state.form.password),
      confirmPassword: md5(state.form.confirmPassword)
    }
    const code = await shiki.postCode(
      Api.cs_noauth + 'ath/superAdminUpdatePwd',
      params
    )
    state.loading = false
    if (shiki.isSuccess(code)) {
      emit('update:modelValue')
      state.visible = false
    }
  }
}
</script>

<style scoped lang="scss"></style>
