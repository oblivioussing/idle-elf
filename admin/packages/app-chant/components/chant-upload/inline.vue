<template>
  <div class="upload-inline">
    <!-- 模版类型 -->
    <div v-if="state.templateList.length" class="item-box">
      <div class="item-label">{{ t('templateType') }}:</div>
      <el-select
        v-model="state.templateId"
        :placeholder="tg('tips.select') + t('templateType')">
        <el-option
          v-for="item in state.templateList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button @click="onDownload" type="primary" class="m-l-15">
        {{ tg('button.downloadTemplate') }}
      </el-button>
    </div>
    <!-- 上传文件 -->
    <el-upload
      ref="uploadRef"
      action="/"
      :auto-upload="false"
      :accept="props.accept"
      :limit="props.limit"
      :multiple="props.limit !== 1 ? true : props.multiple"
      :file-list="state.fileList"
      :show-file-list="false"
      :on-change="onFileChange">
      <el-button type="primary" @click="onBeforeUpload($event)">
        {{ tg('button.upload') }}
      </el-button>
      <!-- slot 单独的操作按钮 -->
      <slot name="operate"></slot>
      <template #tip>
        <div v-if="props.accept" class="size-tip">
          <span>{{ t('onlyUpload') }}{{ accept }}{{ t('file') }}</span>
          <span v-if="props.size">,{{ t('most') }}{{ props.size }}M</span>
        </div>
        <div v-if="!props.accept && props.size" class="size-tip">
          {{ t('most') }}{{ props.size }}M
        </div>
      </template>
    </el-upload>
    <!-- table -->
    <chant-table
      v-model="state"
      :db-edit="false"
      height-wild
      :show-selection="false">
      <template #operation="{ row }">
        <chant-icon-button
          @click="onDelete(row)"
          icon-type="delete"
          type="danger">
        </chant-icon-button>
      </template>
    </chant-table>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { shiki, Api, BlobType } from '@chant/api'
import { base } from '@chant/share'
import { useLister } from '@chant/use'
import columns from './columns'
import { lang, fileVali } from './share'
import ChantTable from '../ChantTable.vue'

interface Props {
  list?: any[] // table list
  accept?: string // 可上传的文件类型
  limit?: number // 文件个数
  multiple?: boolean // 文件多选
  size?: number // 文件大小,单位M
  templateTypeKey?: string // 模版类型
}
// props
const props = withDefaults(defineProps<Props>(), {
  size: 2
})
// lister
const lister = useLister()
// i18n
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
// ref
const uploadRef = ref()
// state
const state = reactive({
  ...lister.state,
  columns,
  lang,
  templateId: '', // 模版id
  templateList: [] as any[], // 模版列表
  list: (base.clone(props.list) as any[]) || [],
  fileList: [],
  timeout: 10, // 超时时间(分钟)
  timer: null as any
})
// 文件列表
watch(
  () => props.list,
  (value) => {
    if (value && value.length) {
      state.list = base.clone(value)
    }
  },
  { deep: true }
)
// computed
const accept = computed(() => {
  return props.accept?.replace(/\./g, '')
})
// defineExpose
defineExpose({
  uploadFile // 文件上传
})
// 获取模版根据类型
if (props.templateTypeKey) {
  getTemplateByType()
}
// 获取模版根据类型
async function getTemplateByType(type?: string) {
  const path = Api.cs + 'sys/findTemplateByType'
  const templateTypeKey = type || props.templateTypeKey
  const { data } = await shiki.getData(path, { templateTypeKey })
  state.templateList = data || []
}
// 下载模版
function onDownload() {
  if (!state.templateId) {
    const msg = tg('tips.select') + t('templateType')
    ElMessage.error(msg)
    return
  }
  const row = state.templateList.find((item) => item.id === state.templateId)
  const path = Api.cs + 'sys/downloadTemplate'
  const config = {
    params: { id: state.templateId },
    blobType: BlobType.Excel,
    filename: `${row.name}.xlsx`
  }
  shiki.download(path, config)
}
// 文件上传之前
function onBeforeUpload(e: Event) {
  if (state.list.length === props.limit) {
    ElMessage.warning(t('beyondTip'))
    e.stopPropagation()
  }
}
// 文件change
async function onFileChange(file: any, files: any) {
  fileDeal(file)
}
// 文件处理
async function fileDeal(file: any) {
  // 文件校验
  if (!fileVali(file, props.size)) {
    return
  }
  const md5 = await base.getMd5ByFile(file.raw)
  // 清空已上传的文件列表
  clearFiles()
  // 根据md5查找文件
  const data: any[] = await findExitsByMd5([md5])
  data.forEach((item) => {
    item.raw = file.raw
    if (!item.relativePath) {
      item.originalFilename = file.name
    }
    const isExit = state.list.find((child) => child.fileMd5 === item.fileMd5)
    if (!isExit) {
      state.list.push(item)
    }
  })
}
// 根据md5查找文件
async function findExitsByMd5(md5: string[]) {
  const path = Api.fs + 'fs/findExitsByMd5'
  const { data, dict } = await shiki.postData(path, { md5 }, { failTip: true })
  const time = dict?.UPLOAD_TIMED_TIME?.UPLOAD_TIMED_TIME
  if (time) {
    state.timeout = Number(time)
  }
  return data
}
// 清空已上传的文件列表
function clearFiles() {
  uploadRef.value?.clearFiles()
}
// 上传文件
async function uploadFile() {
  const files = state.list.filter((item) => !item.relativePath)
  if (!files.length) {
    return listDeal()
  }
  const formData = new FormData()
  files.forEach((item) => {
    formData.append(item.fileMd5, item.raw)
  })
  const path = Api.fs + 'fs/batchUploadFile'
  const config = {
    body: formData,
    timeout: state.timeout * 60 * 1000
  }
  const { resultCode, resultData } = await shiki.upload(path, config)
  if (shiki.isSuccess(resultCode)) {
    resultData.forEach((item: any) => {
      const index = state.list.findIndex(
        (file) => file.fileMd5 === item.fileMd5
      )
      if (index >= 0) {
        state.list[index] = item
      }
    })
    return listDeal()
  }
}
// 列表数据处理
function listDeal() {
  return state.list.map((item) => {
    const { raw, ...other } = item
    return other
  })
}
// 删除文件
function onDelete(row: any) {
  const index = state.list.findIndex((item) => item.fileMd5 === row.fileMd5)
  state.list.splice(index, 1)
  state.fileList = []
}
</script>

<style scoped lang="scss">
@import '../../style/mixin.scss';
@import '../../style/var.scss';
.upload-inline {
  display: flex;
  flex-direction: column;
  width: 100%;
  .item-box {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .item-label {
      padding-right: 10px;
    }
    .el-select {
      max-width: 180px;
      flex: 1;
    }
  }
  .size-tip {
    color: $color-red;
    font-size: 12px;
    padding-top: 5px;
  }
}
</style>
