<template>
  <!-- button -->
  <chant-icon-button
    v-if="props.showButton"
    :content="title"
    :icon="Upload"
    type="primary"
    @click="onClick">
  </chant-icon-button>
  <!-- table -->
  <chant-dialog
    v-model="state.visible"
    type="picker"
    :title="title"
    :loading="state.loading"
    width="760px"
    containerHeight="70vh"
    :options="['close', 'save']"
    @save="onSave">
    <!-- slot -->
    <div>
      <slot></slot>
    </div>
    <!-- 导入类型 -->
    <div v-if="props.importTypeDict" class="item-box">
      <div class="item-label">{{ t('importType') }}:</div>
      <chant-select
        v-model="state.importType"
        :data="props.importTypeDict"
        :placeholder="t('importType')">
      </chant-select>
    </div>
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
      drag
      :auto-upload="false"
      :accept="props.accept"
      :limit="props.limit"
      :multiple="props.limit !== 1 ? true : props.multiple"
      :file-list="state.fileList"
      :show-file-list="false"
      :on-change="onFileChange"
      class="upload-box">
      <div class="upload-container" @click="onBeforeUpload($event)">
        <el-icon class="upload-icon"><upload-filled /></el-icon>
        <div>{{ t('uploadHint') }}</div>
      </div>
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
    <chant-table v-model="state" :db-edit="false" :show-selection="false">
      <template #operation="{ row }">
        <chant-icon-button
          @click="onDelete(row)"
          icon-type="delete"
          type="danger">
        </chant-icon-button>
      </template>
    </chant-table>
  </chant-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Upload, UploadFilled } from '@element-plus/icons-vue'
import { shiki, Api, BlobType } from '@chant/api'
import { base } from '@chant/share'
import { useLister } from '@chant/use'
import columns from './columns'
import { lang, fileVali } from './share'
import ChantDialog from '../ChantDialog.vue'
import ChantTable from '../ChantTable.vue'

interface Props {
  accept?: string // 可上传的文件类型
  auto?: boolean // 点击button后自动展示上传组件
  closeClear?: boolean // 关闭清空数据
  importTypeDict?: Record<string, any> // 导入类型字典
  importTypeApi?: Record<string, any> // 导入类型接口
  limit?: number // 文件个数
  modelValue?: boolean // visible
  multiple?: boolean // 文件多选
  originalFilename?: string // originalFilename字段名(后端遗留问题)
  saveApiParams?: any // 保存接口参数
  saveApiUrl?: string // 保存接口地址
  showButton?: boolean // 上传组件作为按钮显示
  size?: number // 文件大小,单位M
  templateAll?: boolean // 所有模版
  templateType?: string // 模版类型
  title?: string // 标题
}
// props
const props = withDefaults(defineProps<Props>(), {
  auto: true,
  closeClear: true,
  showButton: true,
  size: 2
})
// emit
const emit = defineEmits([
  'click',
  'update:modelValue',
  'upload',
  'upload-success'
])
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
  fileList: [],
  importType: '', // 导入类型
  templateId: '', // 模版id
  templateList: [] as any[], // 模版列表
  timeout: 10, // 超时时间(分钟)
  timer: null as any,
  visible: props.modelValue || false
})
// computed
const title = computed(() => {
  if (props.title) {
    return props.title
  } else {
    return tg('button.import')
  }
})
const accept = computed(() => {
  return props.accept?.replace(/\./g, '')
})
// watch
watch(
  () => state.visible,
  () => {
    if (state.visible) {
      // 获取模版根据类型
      if (props.templateType) {
        getTemplateByType()
      }
      // 获取所有模版
      if (props.templateAll) {
        getAllTemplate()
      }
    } else {
      if (props.closeClear) {
        state.importType = ''
        state.list = []
        state.fileList = []
        state.templateId = ''
        state.templateList = []
      }
    }
    emit('update:modelValue', state.visible)
  }
)
watch(
  () => props.modelValue,
  () => {
    state.visible = props.modelValue || false
  }
)
watch(
  () => state.importType,
  () => {
    state.templateId = ''
    if (state.importType) {
      // 获取模版根据类型
      getTemplateByType(state.importType)
    }
  }
)
// 点击事件
function onClick() {
  if (!props.auto) {
    emit('click')
  } else {
    state.visible = true
  }
}
// 获取模版根据类型
async function getTemplateByType(type?: string) {
  const path = Api.cs + 'sys/findTemplateByType'
  const templateTypeKey = type || props.templateType
  const { data } = await shiki.getData(path, { templateTypeKey })
  state.templateList = data || []
}
// 获取所有模版
async function getAllTemplate() {
  const path = Api.cs + 'sys/findAllTemplate'
  const { data } = await shiki.getData(path)
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
// 保存
async function onSave() {
  // 导入类型
  if (props.importTypeApi) {
    if (!state.importType) {
      ElMessage.error(t('mustImportType'))
      return
    }
  }
  // 文件
  const data = await uploadFile()
  if (!data?.length) {
    ElMessage.error(t('mustFile'))
    return
  }
  let list = base.clone(data) || []
  list = list.map((item) => {
    const { fileName, originalFilename, relativePath } = item
    // 后台返回的是fileName，保存却要filename
    return { filename: fileName, originalFilename, relativePath }
  })
  // 根据接口地址保存
  if (props.saveApiUrl || props.importTypeApi) {
    saveByApiUrl(list)
    return
  }
  emit('upload', { list }, (vali: boolean) => {
    state.loading = false
    if (vali) {
      state.visible = false
    }
  })
}
// 根据接口地址保存
async function saveByApiUrl(list: any[]) {
  let params = {} as Record<string, any>
  if (props.saveApiParams) {
    params = { ...props.saveApiParams }
  }
  if (props.limit === 1) {
    const { filename, originalFilename, relativePath } = list[0]
    params.relativePath = relativePath
    params.originalFilename = originalFilename
    params.filename = filename
  } else {
    // 如果多文件上传有额外参数，合并下并且文件数组为fileList；反之直接数组
    if (props.saveApiParams) {
      params.fileList = list
    } else {
      params = list
    }
  }
  let path
  if (props.importTypeApi) {
    path = props.importTypeApi[state.importType]
  } else {
    path = props.saveApiUrl
  }
  const code = await shiki.postCode(path, params)
  state.loading = false
  if (shiki.isSuccess(code)) {
    emit('upload-success')
    state.visible = false
  }
}
// 上传文件
async function uploadFile() {
  const files = state.list.filter((item) => !item.relativePath)
  if (!files.length) {
    return state.list
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
  state.loading = true
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
    return state.list
  } else {
    state.loading = false
  }
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
.item-box {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .item-label {
    padding-right: 10px;
  }
}
.upload-box {
  :deep(.el-upload-dragger) {
    @include flex-center;
    font-size: 12px;
    height: 135px;
    width: 720px;
    .upload-icon {
      font-size: 40px;
    }
  }
  .upload-container {
    @include flex-center;
    height: 100%;
    width: 100%;
  }
}
.size-tip {
  color: $color-red;
  font-size: 12px;
  padding-top: 5px;
}
</style>
