<template>
  <div class="login">
    <div class="bg-most">
      <div class="mask">
        <div class="company-describe">{{ tg('company.describe') }}</div>
        <div class="company-name">{{ tg('company.name') }}</div>
      </div>
    </div>
    <div class="container">
      <div class="title">
        <img :src="appStore.logo" class="logo" />
        <span>{{ tg('company.project') }}</span>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        size="large"
        class="original"
        @keyup.enter="onLogin()">
        <!-- 账号 -->
        <el-form-item prop="loginName">
          <el-input
            v-model="form.loginName"
            :placeholder="tg('tips.enter') + t('loginName')">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="tg('tips.enter') + t('password')">
          </el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item v-if="isPta" prop="validateCode">
          <el-input
            v-model="form.validateCode"
            :placeholder="tg('tips.enter') + t('validateCode')">
            <template #append>
              <el-image :src="state.validateCode" @click="getValidateCode">
              </el-image>
            </template>
          </el-input>
        </el-form-item>
        <el-button
          @click="onLogin()"
          :loading="state.loading"
          type="primary"
          class="w-100">
          {{ tg('button.login') }}
        </el-button>
      </el-form>
      <div class="t-a-c">
        <span @click="onForget" class="forget">{{ t('forget') }}?</span>
        <span @click="onModify('2')" class="forget">修改密码</span>
      </div>
      <el-divider></el-divider>
      <div class="copyright">Copyright ©2022 {{ tg('company.name') }}</div>
    </div>
  </div>
  <!-- 忘记密码 -->
  <forget-pwd
    v-if="state.forgetPwdVisible"
    v-model="state.forgetPwdVisible"></forget-pwd>
  <!-- 修改密码 -->
  <modify-pwd
    v-if="state.modifyPwdVisible"
    v-model="state.modifyPwdVisible"
    :operator="state.modifyPwdOperator"
    :type="state.modifyPwdType"
    :dict="appStore.dict"
    @modify-success="onLogin('1')"></modify-pwd>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
// @ts-ignore
import md5 from 'js-md5'
import {
  core,
  element,
  shiki,
  storage,
  useAppStore,
  useUserStore,
  Api,
  ApiCode,
  Result,
  StorageEnum
} from 'chant'
import lang from './lang'
import ForgetPwd from './components/forget-pwd/index.vue' // 忘记密码
import ModifyPwd from './components/modify-pwd/index.vue' // 修改密码

// store
const appStore = useAppStore()
const userStore = useUserStore()
// router
const router = useRouter()
// i18n
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
// ref
const formRef = ref()
// state
const state = reactive({
  loading: false,
  forgetPwdVisible: false, // 忘记密码
  modifyPwdVisible: false, // 修改密码
  modifyPwdOperator: {}, // 修改密码 接口返回的用户信息
  modifyPwdType: '2', // 修改密码 1、程序处理；2、修改密码按钮进入
  validateCode: ''
})
const form = reactive({
  loginName: '', // 账号
  password: '', // 密码
  validateCode: '', // 图形验证码
  vcsn: ''
})
const rules = reactive({
  loginName: [
    {
      required: true,
      message: `${t('loginName')}${tg('tips.required')}`
    }
  ],
  password: [
    {
      required: true,
      message: `${t('password')}${tg('tips.required')}`
    }
  ]
})
// isPta
const isPta = core.isPta()
// onMounted
onMounted(() => {
  // 获取图形验证码
  isPta && getValidateCode()
})
// 登陆
async function onLogin(mlf?: string) {
  const valide = await element.validate(formRef.value)
  if (!valide) {
    return
  }
  const params = {
    loginName: form.loginName,
    password: md5(form.password),
    mlf, // 是否强制登陆
    nup: mlf === '1' ? '0' : undefined // 如果修改密码选择否，弹窗关闭并且返回1，但是nup要是0代表直接登陆
  } as any
  if (isPta) {
    params.validateCode = form.validateCode
    params.vcsn = form.vcsn
  }
  let path = isPta ? 'ath/ptavcli' : 'ath/psali'
  state.loading = true
  const result: Result = await shiki.post(Api.cs_noauth + path, {
    body: params,
    tip: false
  })
  // 强制登陆
  if (result.resultCode === ApiCode.ForceLogin) {
    state.loading = false
    const status = await element.confirm(t('forceLogin'))
    if (status) {
      onLogin('1')
    }
  }
  // 验证码错误
  else if (result.resultCode === ApiCode.LoginValiCodeError) {
    state.loading = false
    form.validateCode = ''
    // 获取图形验证码
    getValidateCode()
  }
  // 请修改密码
  else if (result.resultCode === ApiCode.PleaseUpdatePwd) {
    const { resultData, resultDict } = result
    const operator = resultData.operator
    state.modifyPwdOperator = {
      loginName: operator.loginName, // 登录名
      pwdRule: operator.pwdRule, // 正则说明
      pwdRuleDesc: operator.pwdRuleDesc, // 正则方程式
      pwdRuleFlag: operator.pwdRuleFlag, // 开启密码校验规则
      remindUpdatePwdStyle: operator.remindUpdatePwdStyle, // 是否修改密码
      remindUpdatePwdType: operator.remindUpdatePwdType // 过期提示key
    }
    appStore.dict = resultDict
    onModify('1')
  }
  // 登陆成功
  else if (shiki.isSuccess(result.resultCode)) {
    const data = result.resultData
    // 缓存
    storage.setLocal(StorageEnum.User, data)
    storage.setLocal(StorageEnum.Dict, result.resultDict)
    storage.setLocal(StorageEnum.DefaultValue, result.resultDefaultValue)
    userStore.$state = data
    appStore.dict = result.resultDict
    appStore.defaultValue = result.resultDefaultValue
    // 清空nav-tab
    storage.rmSession(StorageEnum.HomeNavTab)
    // 更新权限
    await userStore.updateAuth()
    setTimeout(() => {
      state.loading = false
      router.push('/')
    }, 500)
  }
  // 登陆失败
  else {
    state.loading = false
    ElMessage.error(result.resultMsg)
  }
}
// 获取图形验证码
async function getValidateCode() {
  const { data } = await shiki.getData(Api.cs_noauth + 'ath/validateCode')
  if (data) {
    let path = location.origin
    if (core.inDevelopment()) {
      const apiUrl = core.getBaseApiUrl()
      path = apiUrl.substring(0, apiUrl.length - 1)
    }
    form.vcsn = data.vcsn as string
    state.validateCode = `${path}${data.relativePath}/${data.fileName}`
  }
}
// 忘记密码
function onForget() {
  state.forgetPwdVisible = true
}
// 修改密码
function onModify(type: string) {
  state.loading = false
  state.modifyPwdVisible = true
  state.modifyPwdType = type
}
</script>

<style lang="scss">
@import 'chant/style/mixin.scss';
@import 'chant/style/var.scss';

.login {
  display: flex;
  height: 100vh;
  .bg-most {
    background: url('./assets/bg_login.jpg') no-repeat;
    background-size: 100% 100%;
    flex: 1;
    position: relative;
    .mask {
      background-color: rgba(0, 0, 0, 0.7);
      padding: 30px 60px;
      position: absolute;
      bottom: 0;
      width: 100%;
      .company-describe {
        color: $color-gray1;
        font-size: 28px;
        padding-bottom: 7px;
      }
      .company-name {
        color: $color-gray2;
        font-size: 14px;
        padding-top: 7px;
      }
    }
  }
  .container {
    padding: 120px 60px;
    width: 500px;
    .title {
      display: flex;
      align-items: center;
      font-size: 28px;
      font-weight: bold;
      .logo {
        height: 38px;
        margin-right: 5px;
        width: 38px;
      }
    }
    .original {
      padding-top: 30px;
    }
  }

  .el-input__wrapper {
    padding: 2px;
    .el-input__inner {
      padding: 0 15px;
    }
  }
  .el-input-group__append {
    cursor: pointer;
    padding: 0;
    .el-image {
      height: 38px;
      width: 102px;
    }
  }
  .forget {
    color: $color-gray2;
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    padding-top: 30px;
    & + .forget {
      margin-left: 20px;
    }
  }
  .copyright {
    font-size: 12px;
    padding-top: 20px;
    text-align: center;
  }
}
</style>
