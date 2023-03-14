<template>
  <div :class="{ 'w-100': props.mode === 'input' }">
    <!-- button -->
    <chant-picker-button
      v-if="props.mode === 'input'"
      :name="props.name"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
      @click="onShow"
      @clear="onClear">
    </chant-picker-button>
    <el-button v-if="props.mode === 'button'" type="primary" @click="onShow">
      {{ props.buttonText }}
    </el-button>
    <!-- table -->
    <chant-dialog
      v-model="state.visible"
      append-to-body
      :options="props.multiple ? ['close', 'save'] : []"
      :title="tg('tips.select') + props.placeholder"
      type="picker"
      :width="props.width"
      @close="onClose"
      @save="onSave">
      <div class="flex flex-1 o-h">
        <slot name="left"></slot>
        <div class="flex flex-1 flex-column o-h">
          <!-- operation -->
          <chant-operation
            v-model="state"
            :show-operation="false"
            @query="getList"
            @refresh="onRefresh">
          </chant-operation>
          <!-- table -->
          <chant-table
            v-model="state"
            :column-width="props.columnWidth"
            :db-edit="false"
            picker
            :show-selection="props.multiple"
            @row-click="onRowClick">
          </chant-table>
          <!-- pagination -->
          <chant-pagination
            v-model="state.pages"
            :total="state.total"
            @change="getList">
          </chant-pagination>
        </div>
      </div>
    </chant-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { SysCode } from '../enum/business'
import { base } from '../share'
import { ListColumn as Column } from '../type'
import { useLister } from '../use'
import ChantDialog from './ChantDialog.vue'
import ChantOperation from './chant-operation/index.vue'
import ChantPagination from './ChantPagination.vue'
import ChantTable from './ChantTable.vue'
import ChantPickerButton from './ChantPickerButton.vue'

interface Props {
  buttonText?: string // 按钮显示文字
  code?: string // code
  columns: Column[] // 列表字段
  columnWidth?: number // 列宽度
  dict?: Record<string, any> // 字典
  disabled?: boolean // 是否禁用
  id?: string // id
  keepQuery?: boolean // 保持查询条件
  lang?: Record<string, any> // 国际化
  multiple?: boolean // 是否多选
  mode?: 'button' | 'input' | 'picker' // 展现形式
  name?: string // name
  path: string // 请求路径
  placeholder: string // placeholder
  query?: Record<string, any>
  sysCode?: string
  tenantId?: string
  width?: string // 宽度
  visible?: boolean // 直接显示picker
}
// props
const props = withDefaults(defineProps<Props>(), {
  mode: 'input',
  width: '1090px'
})
// emit
const emit = defineEmits(['change', 'visible-change'])
// lister
const lister = useLister()
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// state
const state = reactive({
  ...lister.state,
  columns: props.columns,
  lang: props.lang,
  visible: props.visible
})
// init
if (props.visible) {
  // 获取列表
  getList()
}
// watch
watch(
  () => props.visible,
  () => {
    state.visible = props.visible
    if (state.visible) {
      // 获取列表
      getList()
    }
  }
)
// 获取列表
async function getList() {
  // 系统类型
  state.tenant.sysCode = props.sysCode as string
  // 平台类型是后台管理系统，租户id必传
  if (props.sysCode === SysCode.Admin) {
    state.tenant.tenantId = props.tenantId as string
  }
  // 额外的参数 重置冲不掉
  if (props.query) {
    state.extraQuery = base.clone(props.query)
  }
  // 显示查询条件
  if (props.keepQuery) {
    const query = Object.assign(props.query || {}, state.query)
    state.query = base.clone(query) || {}
  }
  const status = await lister.getData(props.path, state, { dict: props.dict })
  if (status) {
    // columns
    lister.createColumns(state, props.columns)
  }
}
// 刷新
function onRefresh() {
  lister.reset(state)
  if (props.keepQuery) {
    state.query = base.clone(state.extraQuery)
  }
  getList()
}
// dialog显示
function onShow() {
  state.visible = true
  emit('visible-change', true)
  getList()
}
// dialog隐藏
function onClose() {
  emit('visible-change', false)
  lister.reset(state, true)
}
// 清空
function onClear() {
  emit('change', {})
}
// 行点击
function onRowClick(row: any) {
  if (!props.multiple) {
    emit('visible-change', false)
    state.visible = false
    emit('change', row)
  }
}
// 保存
function onSave() {
  emit('visible-change', false)
  state.visible = false
  emit('change', state.selectionList)
}
</script>

<style scoped lang="scss"></style>
