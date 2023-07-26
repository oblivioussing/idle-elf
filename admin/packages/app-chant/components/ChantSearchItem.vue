<template>
  <el-form-item>
    <div class="flex-center">
      <slot></slot>
      <!-- tooltip -->
      <el-tooltip effect="dark" :content="props.content" placement="top">
        <i class="iconfont icon-ask m-l-5"></i>
      </el-tooltip>
    </div>
  </el-form-item>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string
}>()
</script>

<style scoped lang="scss"></style>
