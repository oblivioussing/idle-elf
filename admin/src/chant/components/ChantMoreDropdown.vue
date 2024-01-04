<template>
  <el-dropdown>
    <span class="dropdown">更多</span>
    <el-icon><More /></el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <slot></slot>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { More } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.dropdown {
  color: var(--main-color);
  cursor: pointer;
  font-size: 12px;
  padding-left: 5px;
}
</style>
