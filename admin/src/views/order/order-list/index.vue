<template>
  <div class="column-box">
    <div class="column-item">
      <chant-table-search :show-fold="false">
        <el-form-item label="订单号:">
          <el-input></el-input>
        </el-form-item>
      </chant-table-search>
      <user-picker></user-picker>
    </div>
    <div class="column-item"></div>
    <div class="column-item">3</div>
  </div>
</template>

<script setup lang="ts">
import UserPicker from '@/components/UserPicker.vue'
</script>

<style scoped lang="scss"></style>
