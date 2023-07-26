<template>
  <div class="page-404">
    <img src="./assests/404.jpg" class="img-404" />
    <div>
      <el-button :icon="Back" size="small" type="primary" @click="onPrevious">
        返回上一页
      </el-button>
      <el-button
        :icon="HomeFilled"
        size="small"
        type="primary"
        @click="onIndex">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Back, HomeFilled } from '@element-plus/icons-vue'

// router
const router = useRouter()
// 返回上一页
function onPrevious() {
  router.go(-1)
}
// 返回首页
function onIndex() {
  router.push('/')
}
</script>

<style scoped lang="scss">
@import 'chant/style/mixin.scss';

.page-404 {
  height: 100%;
  margin-top: 6%;
  text-align: center;
  .img-404 {
    width: 600px;
  }
}
</style>
