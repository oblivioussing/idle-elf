<template>
  <div class="chant-form-footer toolbar">
    <div>
      <!-- 继续新增 -->
      <el-checkbox v-model="state.checked" class="continue">
        {{ t('continue') }}
      </el-checkbox>
    </div>
    <div>
      <!-- 关闭 -->
      <el-button>{{ tg('button.close') }}</el-button>
      <!-- 保存 -->
      <el-button type="primary">{{ tg('button.save') }}</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

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
