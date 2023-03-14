<template>
  <chant-icon-button
    v-if="props.button"
    v-bind="{ ...$attrs }"
    icon-type="upload"
    @click="onTrigger">
  </chant-icon-button>
  <el-upload
    v-show="!props.button"
    ref="uploadRef"
    action="/"
    :auto-upload="false"
    :accept="props.accept"
    :show-file-list="false"
    :on-change="onFileChange"
    v-loading="state.loading"
    v-bind="$attrs"
    :class="{
      'chant-upload-single': !props.button
    }">
    <img v-if="state.imgUrl" :src="state.imgUrl" class="w-100" />
    <el-icon v-else class="upload-icon"><Plus /></el-icon>
    <el-icon v-if="state.imgUrl" @click.stop="onDelete" class="delete-icon">
      <Delete />
    </el-icon>
  </el-upload>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { base, shiki, Api, BlobType } from '@chant'
import { fileVali } from './share'

// props
const props = defineProps<{
  accept?: string // 可上传的文件类型
  button?: boolean // 展示为一个button
  size?: number // 文件大小限制
  url?: string // 图片url
}>()
// emit
const emit = defineEmits(['upload'])
// ref
const uploadRef = ref()
// state
const state = reactive({
  imgUrl: props.url,
  loading: false,
  timeout: 10 // 超时时间(分钟)
})
// 按钮出发文件选择
function onTrigger() {
  const el = uploadRef.value.$el as HTMLElement
  const uploadEL = el.querySelector('.el-upload') as HTMLElement
  uploadEL?.click()
}
// 文件change
async function onFileChange(file: any) {
  // 文件校验
  if (!fileVali(file, props.size)) {
    return
  }
  const md5 = await base.getMd5ByFile(file.raw)
  // 根据md5查找文件
  const data = await findExitsByMd5([md5])
  if (data?.relativePath) {
    uploadEmit(data)
  } else {
    const formData = new FormData()
    formData.append(data.fileMd5, file.raw)
    // 文件上传
    const ret = await onUpload(formData)
    uploadEmit(ret)
  }
  state.imgUrl = URL.createObjectURL(file.raw)
}
// 文件上传emit
function uploadEmit(row: any) {
  emit('upload', {
    relativePath: row.relativePath,
    originalFilename: row.originalFilename,
    filename: row.fileName
  })
}
// 文件上传
async function onUpload(formData: any) {
  const config = {
    body: formData,
    timeout: state.timeout * 60 * 1000
  }
  const path = Api.fs + 'fs/batchUploadFile'
  state.loading = true
  const ret = await shiki.upload(path, config)
  state.loading = false
  if (shiki.isSuccess(ret.resultCode)) {
    return ret.resultData?.[0]
  }
}
// 根据md5查找文件
async function findExitsByMd5(md5: string[]) {
  const path = Api.fs + 'fs/findExitsByMd5'
  const { data, dict } = await shiki.postData(path, { md5 }, { failTip: true })
  const time = dict?.UPLOAD_TIMED_TIME?.UPLOAD_TIMED_TIME
  if (time) {
    state.timeout = Number(time)
  }
  return data?.[0]
}
// 删除文件
function onDelete() {
  state.imgUrl = ''
  emit('upload', {})
}
</script>

<style lang="scss">
@import '../../style/var.scss';

.chant-upload-single {
  .el-upload {
    border: 1px dashed $color-gray2;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    height: 100px;
    overflow: hidden;
    position: relative;
    width: 100px;
  }
  .upload-icon {
    color: $color-gray2;
    font-size: 28px;
  }
  .delete-icon {
    color: $color-red;
    font-size: 20px;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
