<template>
  <el-button-group v-if="props.count > 1">
    <slot></slot>
  </el-button-group>
  <div v-else v-if="props.count === 1">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// props
const props = defineProps<{
  count: number
}>()
</script>

<style scoped lang="scss"></style>
