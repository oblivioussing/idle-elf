<template>
  <div class="chant-form">
    <el-form :model="state" ref="formRef">
      <div v-for="item in 10" class="chant-form-item">
        <el-form-item prop="email" label="Email">
          <el-input v-model="state.email" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

// ref
const formRef = ref<FormInstance>()
// state
const state = reactive({
  email: ''
})
</script>

<style scoped lang="scss">
.chant-form {
  border: 1px red solid;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  .chant-form-item {
    display: inline-block;
    height: min-content;
  }
}
</style>

<style lang="scss">
.chant-form {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    border: 1px black solid;
  }
}
</style>
