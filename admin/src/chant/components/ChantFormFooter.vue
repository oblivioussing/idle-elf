<template>
  <div class="chant-form-footer toolbar">
    <div>
      <!-- 继续新增 -->
      <el-checkbox v-model="vModel.continueAdd" class="continue">
        {{ t('continue') }}
      </el-checkbox>
    </div>
    <div>
      <!-- 关闭 -->
      <el-button @click="core.closePage()">{{ tg('button.close') }}</el-button>
      <!-- 保存 -->
      <el-button
        :loading="vModel.loading"
        type="primary"
        @click="emits('save')">
        {{ tg('button.save') }}
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'
import { core } from '@/utils'

// type
type ModelValue = {
  continueAdd: boolean
  loading: boolean
}
// props
const props = defineProps<{
  modelValue: ModelValue // modelValue
}>()
// emits
const emits = defineEmits(['update:modelValue', 'save'])
// use
const { t: tg } = useI18n({ useScope: 'global' })
const { t } = useI18n({
  messages: {
    en: {
      continue: 'continue add'
    },
    zh: {
      continue: '继续新增'
    }
  }
})
const vModel = useVModel(props, 'modelValue', emits)
// state
const state = reactive({
  checked: false
})
</script>
<style scoped lang="scss">
.chant-form-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  :deep(.el-button + .el-button) {
    margin-left: 8px;
  }
  .continue {
    font-weight: normal;
  }
}
</style>
