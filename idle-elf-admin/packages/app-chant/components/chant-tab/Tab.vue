<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// props
defineProps<{
  label?: string
  name?: string | number
}>()
</script>

<style scoped lang="scss"></style>
