<template>
  <el-tooltip
    :content="props.content"
    :disabled="!props.content"
    effect="dark"
    placement="top">
    <el-button
      v-bind="$attrs"
      class="chant-button"
      :disabled="props.disabled"
      :link="props.link"
      :type="props.type || 'primary'">
      <slot></slot>
      <el-icon v-if="props.icon"><component :is="props.icon" /></el-icon>
      <icon-font v-if="props.iconfont" :icon="props.iconfont"></icon-font>
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { buttonProps } from 'element-plus'

// props
const props = defineProps({
  content: String,
  iconfont: String,
  ...buttonProps
})
</script>

<style lang="scss">
.chant-button {
  height: 28px;
  width: 28px;
  padding: 0;
}
</style>
