<template>
  <div class="home-header">
    <div class="left">
      <img src="/image/logo.png" class="logo-ic" />
      <div>野鬼的窝</div>
      <img src="./img/ic_menu.png" class="menu-ic" @click="onCollapse" />
    </div>
    <div class="right">
      <!-- 退出 -->
      <el-dropdown @command="onQuit">
        <div class="dropdown">
          <el-avatar :src="avatarUrl" :size="25">
            <img
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </el-avatar>
          <div class="t-a-c m-l-5">
            <div>登录名</div>
            <div>姓名</div>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="quit">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { StorageEnum } from '@/enum'
import { base, storage } from '@/share'
import { useAppStore, useUserStore } from '@/store'

// props
const props = defineProps<{
  modelValue: boolean
}>()
// emit
const emit = defineEmits(['update:modelValue'])
// use
const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()
// state
const state = reactive({
  orgs: [] as any[],
  isCollapse: props.modelValue,
  noticeVisible: false
})
// computed
const avatarUrl = computed(() => {
  return ''
})
// 切换
function onCollapse() {
  state.isCollapse = !state.isCollapse
  emit('update:modelValue', state.isCollapse)
}
// 退出
async function onQuit() {
  storage.rmLocal(StorageEnum.User)
  userStore.$state = {} as any
  router.push('/login')
}
</script>

<style scoped lang="scss">
@import '@/style/var.scss';
.home-header {
  background-color: $color-black;
  color: $color-white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  height: 45px;
  padding: 0 10px;
  .left {
    display: flex;
    align-items: center;
    font-size: 18px;
    .logo-ic {
      margin-right: 5px;
      width: 20px;
    }
    .menu-ic {
      margin-left: 5px;
      cursor: pointer;
      width: 25px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .badge {
      cursor: pointer;
      top: -10px;
      right: -5px;
    }
    .dropdown {
      color: $color-white;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-left: 10px;
      .arrow-down-icon {
        color: $color-gray2;
      }
    }
  }
}
</style>
