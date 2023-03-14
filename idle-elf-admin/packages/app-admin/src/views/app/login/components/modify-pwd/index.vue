<template>
  <chant-dialog
    :title="t('modifyPwdTitle')"
    v-model="state.visible"
    :loading="state.loading"
    :options="['close', 'save']"
    @close="dialoger.close()"
    @save="onSave"
    append-to-body
    width="640px">
    <el-alert
      :title="state.title"
      :closable="false"
      type="warning"
      show-icon></el-alert>
    <chant-form
      linefeed
      ref="formRef"
      :rules="rules"
      label-width="125px"
      v-model="state"
      in-dialog>
      <chant-form-item
        label="是否修改密码"
        v-if="props.operator.remindUpdatePwdStyle === '1'">
        <el-radio-group v-model="state.form.nup">
          <el-radio
            v-for="(item, key) in props.dict['remindUpdatePwdFlag']"
            :label="key"
            :key="key">
            {{ item }}
          </el-radio>
        </el-radio-group>
      </chant-form-item>
    </chant-form>
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
  operator: {
    loginName?: string // 登录名
    pwdRule?: string // 正则说明
    pwdRuleDesc?: string // 正则方程式
    pwdRuleFlag?: string // 开启密码校验规则
    remindUpdatePwdStyle?: string // 是否修改密码
    remindUpdatePwdType?: string // 过期提示key
  }
  type: string // 1、程序处理；2、修改密码按钮进入
  dict: {}
}>()
// emit
const emit = defineEmits(['update:modelValue', 'modify-success'])
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
  title: '修改密码'
})
const newPasswordValidator = (rule: object, value: string, callback: any) => {
  if (!value) {
    return callback(new Error(`${t('newPassword')}${tg('tips.required')}`))
  }
  // 开启密码校验规则并且密码校验规则不为空
  if (props.operator.pwdRuleFlag === '1' && props.operator.pwdRuleDesc) {
    const pwdRule = new RegExp(props.operator.pwdRuleDesc)
    const msg = props.operator.pwdRule || '密码校验规则不符合，请联系管理员'
    // 拿新密码来匹配
    if (!pwdRule.test(state.form.newPassword)) {
      return callback(new Error(msg))
    }
  }
  callback()
}
const rules = reactive({
  loginName: [
    { required: true, message: `${t('loginName')}${tg('tips.required')}` }
  ],
  password: [
    { required: true, message: `${t('password')}${tg('tips.required')}` }
  ],
  newPassword: [{ required: true, validator: newPasswordValidator }],
  confirmPassword: [
    { required: true, message: `${t('confirmPassword')}${tg('tips.required')}` }
  ]
})
// created
former.created(() => {
  state.form.nup = '1'
  // type为1时是接口返回的，带的有具体的提示信息
  if (props.type === '1') {
    if (props.operator.remindUpdatePwdType) {
      const remindUpdatePwdType = props.dict['remindUpdatePwdType']
      state.title = remindUpdatePwdType[props.operator.remindUpdatePwdType]
    }
    // 登录名接口返回带过来
    state.form.loginName = props.operator?.loginName
  }
}, state)
// 保存
async function onSave() {
  // 不修改密码
  if (state.form.nup === '0') {
    emit('modify-success')
    emit('update:modelValue')
    state.visible = false
  }
  // 修改密码
  const status = await element.validate(formRef.value.formRef)
  if (status) {
    state.loading = true
    const params = {
      loginName: state.form.loginName,
      password: md5(state.form.password),
      newPassword: md5(state.form.newPassword),
      confirmPassword: md5(state.form.confirmPassword)
    }
    const code = await shiki.postCode(
      Api.cs_noauth + 'ath/platformUpdPwd',
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
