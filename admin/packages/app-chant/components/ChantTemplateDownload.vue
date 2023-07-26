<template>
  <chant-dialog
    v-model="state.visible"
    :loading="state.loading"
    :options="['close', 'save']"
    :title="t('title')"
    width="500px"
    @close="dialoger.close()"
    @save="onSave">
    <chant-form
      ref="formRef"
      v-model="state"
      in-dialog
      label-width="100px"
      linefeed
      :rules="rules">
      <chant-form-item :label="t('exportTemplate')" prop="templateCode">
        <chant-select
          v-model="state.form.templateCode"
          :data="state.templateList"
          :placeholder="t('exportTemplate')"
          label="name"
          value="templateCode">
        </chant-select>
      </chant-form-item>
    </chant-form>
  </chant-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { element, shiki, useDialoger, useFormer, Api, BlobType } from '@chant'
import { ListParams } from '@chant/type'

interface Props {
  filename: string
  listParams: ListParams
  modelValue: boolean
  path: string
  templateType: string
}
// props
const props = withDefaults(defineProps<Props>(), {})
// emit
defineEmits(['update:modelValue', 'update'])
// use
const dialoger = useDialoger()
const former = useFormer()
// i18n
const { t } = useI18n({
  messages: {
    en: {
      title: 'download template',
      exportTemplate: 'export template'
    },
    zh: {
      title: '下载模版',
      exportTemplate: '导出模版'
    }
  },
  form: {
    templateCode: '' // 模板
  }
})
const { t: tg } = useI18n({ useScope: 'global' })
// ref
const formRef = ref()
// state
const state = reactive({
  ...former.state,
  templateList: [],
  visible: props.modelValue
})
const rules = reactive({
  // 模板
  templateCode: [
    {
      required: true,
      message: `${t('exportTemplate')}${tg('tips.required')}`
    }
  ]
})
// init
getTemplateList() // 获取模板列表
// 获取模板列表
async function getTemplateList() {
  const path = Api.cs + 'sys/findTemplateByType'
  const query = { templateTypeKey: props.templateType }
  const { data } = await shiki?.getData(path, query)
  state.templateList = data || []
}
// 保存
async function onSave() {
  const status = await element.validate(formRef.value.formRef as any)
  if (!status) {
    return
  }
  const config = {
    blobType: BlobType.Excel,
    filename: `${props.filename}.xlsx`,
    params: {
      ...props.listParams,
      templateCode: state.form.templateCode
    }
  }
  shiki.download(props.path, config)
  // 延迟1秒自动关闭弹窗
  setTimeout(() => {
    dialoger.close()
  }, 1000)
}
</script>

<style scoped lang="scss"></style>
