<template>
  <div class="chant-tree">
    <div v-if="showSysTenant()" class="toolbar tree-tenant">
      <chant-sys-tenant
        v-model="state"
        :sys-disabled="props.sysDisabled"
        :tenant-tips="tenantTips"
        :tenant-classify="props.tenantClassify"
        type="normal">
      </chant-sys-tenant>
    </div>
    <div class="tree-container">
      <!-- 组织 -->
      <org-tree
        v-if="props.type === 'org'"
        ref="orgRef"
        v-bind="{ ...$attrs, ...props }"
        :sys-code="state.sysCode"
        :tenant-id="state.tenantId"
        :tenant-name="state.tenantName"
        @check="onCheck"
        @check-change="onCheckChange"
        @node-click="onNodeClick">
      </org-tree>
      <!-- 路由 -->
      <router-tree
        v-if="props.type === 'router'"
        ref="routerRef"
        v-bind="{ ...$attrs, ...props }"
        :sys-code="state.sysCode"
        :tenant-id="state.tenantId"
        :tenant-name="state.tenantName"
        @check="onCheck"
        @check-change="onCheckChange"
        @node-click="onNodeClick"
        @update="onUpdate">
        <template #="{ row }">
          <slot :row="row"></slot>
        </template>
      </router-tree>
      <!-- 默认 -->
      <el-tree
        v-if="!props.type"
        ref="elRef"
        :data="props.data"
        v-bind="$attrs"
        :tenant-id="state.tenantId"
        @check="onCheck"
        @check-change="onCheckChange"
        @node-click="onNodeClick"
        class="tree">
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, reactive, ref, watch } from 'vue'
import { TenantClassify } from '../../enum'
import { core } from '../../share'

const OrgTree = defineAsyncComponent(() => import('./components/org/index.vue')) // 组织
const RouterTree = defineAsyncComponent(
  () => import('./components/router/index.vue')
) // 路由

interface Props {
  apiParams?: object // 接口查询参数
  checkedKeys?: Record<'id', string>[] | [] // 选中的节点
  checkStrictly?: boolean // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
  data?: any[] // 展示数据
  dict?: object // 字典
  initRoot?: boolean // 默认初始化点击根节点
  loading?: boolean // loading
  multiple?: boolean // checkbox是否多选
  over?: boolean // 请求结束
  readonly?: boolean // 是否只读
  showTenant?: boolean // 显示租户
  sysCode?: string // 租户类型
  sysDisabled?: boolean // 禁用系统类型选择
  tenantClassify?: TenantClassify // 租户分类
  tenantTips?: string // 租户文本提示
  tenantId?: string // 租户id
  tenantName?: string // 租户名称
  type?: 'org' | 'router' // tree类型
}
// props
const props = withDefaults(defineProps<Props>(), {})
// emit
const emit = defineEmits(['check', 'check-change', 'node-click', 'update'])
// ref
const orgRef = ref()
const routerRef = ref()
const categoryRef = ref()
const elRef = ref()
// reactive
const state = reactive({
  sysCode: props.sysCode,
  tenantId: props.tenantId,
  tenantName: props.tenantName
})
// defineExpose
defineExpose({
  elRef,
  routerRef,
  edit, // 编辑
  update // 更新
})
// watch
watch(
  () => props.tenantId,
  () => {
    state.tenantId = props.tenantId
  }
)
// 是否显示sys-tenant
function showSysTenant() {
  if (core.isPta() && !props.tenantClassify) {
    return false
  }
  return props.showTenant
}
// 复选框选中
function onCheck(node: any, nodes: any) {
  emit('check', node, nodes)
}
// 当复选框被点击的时候触发
function onCheckChange(node: any, checked: boolean, childChecked: boolean) {
  emit('check-change', node, checked, childChecked)
}
// 节点点击
function onNodeClick(row: any) {
  emit('node-click', row)
}
// 更新事件
function onUpdate() {
  emit('update')
}
// 编辑
function edit(row: any) {
  execMethod('onEdit', row)
}
// 更新
function update() {
  execMethod('onUpdate')
}
// 执行方法
function execMethod(val: string, row?: any) {
  const map = {
    org: orgRef.value,
    router: routerRef.value,
    category: categoryRef.value
  }
  if (props.type) {
    const targetRef = map[props.type]
    const method = targetRef && targetRef[val]
    if (method) {
      method(row)
    } else {
      console.warn(`${method}方法不存在`)
    }
  }
}
</script>

<style lang="scss">
@import './style/index.scss';
</style>
