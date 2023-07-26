<template>
  <chant-dialog
    :title="title + tg('button.edit')"
    :loading="state.loading"
    :options="['close', 'save']"
    @close="dialoger.close()"
    @save="onSave">
    <chant-form
      ref="formRef"
      v-model="state"
      label-width="110px"
      :inDialog="true"
      type="edit">
      <!-- 机构名称,岗位名称 -->
      <template #orgName-label>{{ title }}{{ t('name') }}:</template>
      <!-- 机构别名,岗位别名 -->
      <template #aliasName-label>{{ title }}{{ t('aliasName') }}:</template>
      <!-- 首页管理 -->
      <index-manage
        v-model="state.form.orgSysIndexList"
        :dict="state.resultDict">
      </index-manage>
    </chant-form>
  </chant-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { shiki, Api } from '@chant/api'
import { element } from '@chant/plugs'
import { useDialoger, useFormer } from '@chant/use'
import ChantDialog from '@chant/components/ChantDialog.vue'
import ChantForm from '@chant/components/ChantForm.vue'
import { dict, model, lang, OrgType } from './share'
import IndexManage from './components/index-manage/index.vue' // 首页管理

// props
const props = defineProps<{
  id: string
}>()
// emit
const emit = defineEmits(['update:modelValue', 'save'])
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
  model,
  lang,
  form: {
    tenantId: '',
    orgType: '' as OrgType,
    orgSysIndexList: []
  }
})
// computed
const title = computed(() => {
  if (state.form.orgType === '1') {
    return t('organization')
  } else {
    return t('post')
  }
})
// onMounted
onMounted(() => {
  // 获取详情
  getDetail()
})
// 获取详情
function getDetail() {
  state.query.id = props.id
  const path = Api.cs + 'ath/viewOrg'
  former.getData(path, state, { dict })
}
// 保存
async function onSave() {
  const status = await element.validate(formRef.value.formRef)
  if (!status) {
    return
  }
  const path = Api.cs + 'ath/updateOrg'
  state.loading = true
  const code = await shiki.postCode(path, state.form)
  state.loading = false
  if (shiki.isSuccess(code)) {
    emit('save')
    dialoger.close()
  }
}
</script>

<style scoped lang="scss"></style>
