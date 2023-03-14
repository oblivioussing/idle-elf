<template>
  <!-- button -->
  <el-button @click="state.visible = true" type="primary">
    <i v-if="state.icon" class="iconfont" :class="state.icon"></i>
    <template v-else>{{ tg('tips.pick') }}</template>
  </el-button>
  <!-- dialog -->
  <chant-dialog
    v-model="state.visible"
    :title="tg('tips.pick') + t('icon')"
    width="1024px"
    type="scrollPicker">
    <div class="icon-box">
      <div v-for="item in state.list" @click="onPick(item)" class="icon-item">
        <div v-if="item === state.icon" class="checked">
          <el-icon class="checked-icon">
            <Check />
          </el-icon>
        </div>
        <div class="t-a-c o-h" :class="{ active: item === state.icon }">
          <i class="iconfont" :class="item"></i>
          <div class="ellipsis-1 p-5 f-z-12">{{ item }}</div>
        </div>
      </div>
    </div>
  </chant-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check } from '@element-plus/icons-vue'
import { shiki, Api } from '../api'

// props
const props = defineProps<{
  modelValue: any
}>()
// emit
const emit = defineEmits(['update:modelValue'])
// i18n
const { t } = useI18n({
  messages: {
    en: { icon: ' icon' },
    zh: { icon: '图标' }
  }
})
const { t: tg } = useI18n({ useScope: 'global' })
// state
const state = reactive({
  icon: props.modelValue,
  list: [],
  loading: false,
  visible: false
})
// init
// 获取图标
getIcon()
// 获取图标
async function getIcon() {
  state.loading = true
  const { data } = await shiki.getData(Api.cs + 'sys/getIconPrjDict')
  state.loading = false
  if (data) {
    state.list = data
  }
}
// 选中
function onPick(icon: string) {
  state.icon = icon
  emit('update:modelValue', icon)
  state.visible = false
}
</script>

<style scoped lang="scss">
@import '../style/mixin.scss';
@import '../style/var.scss';
.dialog-scroll-picker {
  .icon-box {
    border-color: $color-gray3 transparent transparent $color-gray3;
    border-style: solid;
    border-width: 1px 0 0 1px;
    display: flex;
    flex-wrap: wrap;
    margin-right: 10px;
    margin-bottom: 15px;
    .icon-item {
      @include flex-center;
      border-color: transparent $color-gray3 $color-gray3 transparent;
      border-style: solid;
      border-width: 0 1px 1px 0;
      cursor: pointer;
      height: 110px;
      position: relative;
      width: 12.5%;
      .active {
        color: $color-base;
      }
      .iconfont {
        font-size: 26px;
      }
      .checked {
        border-color: $color-base $color-base transparent transparent;
        border-style: solid;
        border-width: 20px;
        height: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 0;
        .checked-icon {
          color: $color-white;
          font-size: 20px;
          position: absolute;
          top: -17px;
          right: -18px;
        }
      }
    }
  }
}
</style>
