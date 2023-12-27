<template>
  <el-upload
    v-model:file-list="state.fileList"
    action="/"
    :auto-upload="false"
    class="chant-upload"
    :class="[props.type]"
    :limit="props.limit"
    :multiple="props.multiple"
    :show-file-list="showFileList">
    <!-- file-list -->
    <el-button v-if="props.type === UploadTypeEnum.FileList" type="primary">
      {{ t('clickUpload') }}
    </el-button>
    <!-- single-image -->
    <template v-if="props.type === UploadTypeEnum.SingleImage">
      <el-image v-if="state.imageUrl" class="image" :src="state.imageUrl">
      </el-image>
      <el-icon v-else class="uploader-icon"><Plus /></el-icon>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { UploadTypeEnum } from '../enum'

// type
interface Props {
  limit?: number // 允许上传文件的最大数量
  multiple?: boolean // 是否支持多选文件
  type: UploadTypeEnum // 文件上传类型
}
// props
const props = withDefaults(defineProps<Props>(), {
  type: UploadTypeEnum.SingleImage
})
// use
const { t } = useI18n({
  messages: {
    en: {
      clickUpload: 'click upload'
    },
    zh: {
      clickUpload: '点击上传'
    }
  }
})
// state
const state = reactive({
  imageUrl: '',
  fileList: []
})
// computed
const showFileList = computed(() => {
  if (props.type === UploadTypeEnum.SingleImage) {
    return false
  }
  return true
})
</script>

<style lang="scss">
.chant-upload.single-image {
  .image {
    display: block;
    height: 135px;
    width: 135px;
  }
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    transition: var(--el-transition-duration-fast);
  }
  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  .uploader-icon {
    color: #8c939d;
    font-size: 28px;
    text-align: center;
    height: 135px;
    width: 135px;
  }
}
</style>
