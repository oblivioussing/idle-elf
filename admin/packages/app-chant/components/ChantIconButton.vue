<template>
  <el-tooltip
    effect="dark"
    :content="content"
    :disabled="props.tipDisabled"
    :placement="props.placement">
    <el-button
      v-bind="$attrs"
      :circle="props.circle"
      :color="props.color"
      :disabled="props.disabled"
      :icon="icon"
      :type="props.type || 'primary'"
      class="chant-icon-button"
      :style="{ color: props.color ? 'white' : '' }"
      :class="[
        {
          'has-iconfont': props.iconfont,
          small: props.size === 'small',
          normal: props.size === 'normal'
        }
      ]"
      @click="emit('click', $event)">
      <i v-if="props.iconfont" class="iconfont" :class="props.iconfont"> </i>
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
import { computed, Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { Placement } from 'element-plus'
import {
  Close,
  CopyDocument,
  Delete,
  DocumentCopy,
  Download,
  Edit,
  Lock,
  Minus,
  Plus,
  Right,
  Search,
  Setting,
  Sort,
  Unlock,
  Upload,
  Refresh
} from '@element-plus/icons-vue'

type IconType =
  | 'add'
  | 'close'
  | 'copy'
  | 'delete'
  | 'documentCopy'
  | 'download'
  | 'edit'
  | 'minus'
  | 'lock'
  | 'query'
  | 'setting'
  | 'sort'
  | 'transfer'
  | 'unlock'
  | 'upload'
  | 'refresh'

interface Props {
  circle?: boolean
  color?: string
  content?: string
  disabled?: boolean
  icon?: Component
  iconType?: IconType
  iconfont?: string
  placement?: Placement
  size?: 'large' | 'normal' | 'small'
  tipDisabled?: boolean
  type?: 'danger' | 'primary' | 'info' | 'warning' | 'success'
}
// props
const props = withDefaults(defineProps<Props>(), {
  placement: 'top'
})
// emit
const emit = defineEmits(['click'])
// i18n
const { t } = useI18n({
  useScope: 'global',
  messages: {
    en: {
      setting: '设置',
      sort: 'sort',
      transfer: 'transfer'
    },
    zh: {
      setting: '设置',
      sort: '排序',
      transfer: '转移'
    }
  }
})
const { t: tg } = useI18n({ useScope: 'global' })
// computed
const content = computed(() => {
  if (props.content) {
    return props.content
  }
  if (props.iconType) {
    const map = {
      add: tg('button.add'),
      close: tg('button.close'),
      copy: tg('button.copy'),
      documentCopy: tg('button.copy'),
      delete: t('button.delete'),
      download: tg('button.export'),
      edit: tg('button.edit'),
      lock: tg('button.lock'),
      minus: t('button.delete'),
      query: tg('button.query'),
      setting: t('setting'),
      sort: t('sort'),
      transfer: t('transfer'),
      unlock: tg('button.unlock'),
      upload: tg('button.import'),
      refresh: tg('button.refresh')
    }
    return map[props.iconType]
  }
})
const icon = computed(() => {
  if (props.icon) {
    return props.icon
  }
  if (props.iconType) {
    const map = {
      add: Plus,
      close: Close,
      copy: CopyDocument,
      documentCopy: DocumentCopy,
      delete: Delete,
      download: Download,
      edit: Edit,
      lock: Lock,
      minus: Minus,
      query: Search,
      refresh: Refresh,
      setting: Setting,
      sort: Sort,
      transfer: Right,
      unlock: Unlock,
      upload: Upload
    }
    return map[props.iconType]
  }
})
</script>

<style lang="scss">
.chant-icon-button {
  &.small {
    min-width: 20px !important;
    height: 20px !important;
    width: 20px !important;
  }
  &.normal {
    min-width: 24px !important;
    height: 24px !important;
    width: 24px !important;
  }
  &.el-button {
    min-width: 28px;
    height: 28px;
    width: 28px;
    padding: 0;
    &.has-iconfont {
      span {
        display: inline-block;
      }
    }
    span {
      display: none;
    }
  }
}
</style>
