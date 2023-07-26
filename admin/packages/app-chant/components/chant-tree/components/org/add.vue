<template>
  <chant-dialog
    :title="title + tg('button.add')"
    :loading="state.loading"
    :options="['close', 'save']"
    @close="dialoger.close()"
    @save="onSave">
    <chant-form
      ref="formRef"
      v-model="state"
      label-width="110px"
      :inDialog="true">
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
  nodeData: any
  tenantId?: string // 租户id
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
  if (state.form.orgType === OrgType.Organization) {
    return t('organization')
  } else {
    return t('post')
  }
})
// onMounted
onMounted(() => {
  state.form = { ...props.nodeData }
  // 获取字典
  getDict()
})
// 获取字典
function getDict() {
  former.getDict(Api.cs + 'ath/getOrgDict', state, { dict })
}
// 保存
async function onSave() {
  const status = await element.validate(formRef.value.formRef)
  if (!status) {
    return
  }
  // 租户id
  state.form.tenantId = props.tenantId!
  const path = Api.cs + 'ath/saveOrg'
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
