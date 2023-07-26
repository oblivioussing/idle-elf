<template>
  <el-tree
    ref="treeRef"
    :data="props.data || state.tree"
    v-loading="state.loading"
    default-expand-all
    :default-checked-keys="state.checkedKeys"
    :expand-on-click-node="false"
    node-key="id"
    :show-checkbox="props.showCheckbox"
    v-bind="$attrs"
    @node-click="onNodeClick"
    @check="onCheck"
    @check-change="onCheckChange">
    <template #default="{ _, data }">
      <div class="row-box">
        <div class="flex-align-center">
          <div v-if="!props.showCheckbox" class="number p-r-5">
            {{ data.serialNo }}
          </div>
          <div class="label">
            <div>{{ data.orgName }}</div>
            <div class="p-l-3">- {{ orgTypeDict(data) }}</div>
          </div>
        </div>
        <div v-if="!props.readonly" class="button-box">
          <!-- 新增组织,新增岗位 -->
          <template v-if="data.orgType !== '2'">
            <el-button
              @click.stop="onAdd(data, '2')"
              type="text"
              :icon="User"
              class="icon-user">
            </el-button>
            <el-button
              @click.stop="onAdd(data, '1')"
              type="text"
              :icon="Flag"
              class="icon-flag">
            </el-button>
          </template>
          <!-- 删除 -->
          <el-button
            v-if="data.parentCode !== '0'"
            @click.stop="onDel(data)"
            type="text"
            :icon="Delete"
            class="red">
          </el-button>
          <!-- 编辑 -->
          <el-button @click.stop="onEdit(data)" type="text" :icon="Edit">
          </el-button>
        </div>
      </div>
    </template>
  </el-tree>
  <el-button
    v-if="showAddCpd"
    @click="onAdd()"
    type="primary"
    class="gravity-center">
    {{ t('add') }}
  </el-button>
  <!-- 新增 -->
  <add
    v-if="state.addVisible"
    v-model="state.addVisible"
    :node-data="state.nodeData"
    :tenant-id="props.tenantId"
    @save="onUpdate(true)">
  </add>
  <!-- 编辑 -->
  <edit
    v-if="state.editVisible"
    v-model="state.editVisible"
    :id="state.id"
    @save="onUpdate(true)">
  </edit>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete, Edit, Flag, User } from '@element-plus/icons-vue'
import { shiki, Api } from '@chant/api'
import { SysCode } from '@chant/enum'
import { element } from '@chant/plugs'
import { base } from '@chant/share'
import { useUserStore } from '@chant/store'
import add from './add.vue'
import edit from './edit.vue'

// props
const props = defineProps<{
  apiParams?: object // 接口查询参数
  checkedKeys?: any[] // 选中的节点
  checkStrictly?: boolean // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
  data?: any[] // 展示数据
  dict?: object // 字典
  initRoot?: boolean // 默认执行一次node-click获取根节点数据
  loading?: boolean // loading
  multiple?: boolean // checkbox是否多选
  over?: boolean // 请求结束
  readonly?: boolean // 是否只读
  showCheckbox?: boolean // 显示checkbox
  sysCode?: string // 系统类型code
  tenantId?: string // 租户id
  tenantName?: string // 租户名称
}>()
// emit
const emit = defineEmits(['check', 'check-change', 'node-click', 'update'])
// store
const userStore = useUserStore()
// i18n
const { t } = useI18n({
  messages: {
    en: {
      add: 'organization add',
      deleteTips: 'delete post?',
      deleteAllTips:
        'are you sure this operation will permanently delete this organization node and subordinate positions?'
    },
    zh: {
      add: '组织新增',
      deleteTips: '是否删除岗位?',
      deleteAllTips: '确定此操作将永久删除该机构节点以及下属岗位, 是否继续?'
    }
  }
})
// ref
const treeRef = ref()
// state
const state = reactive({
  checkStrictly: props.checkStrictly,
  checkedKeys: [] as any[],
  tree: [],
  dict: {} as any,
  nodeData: {
    level: 1,
    parentId: '',
    parentCode: '',
    parentName: '',
    orgType: ''
  },
  id: '',
  ready: false,
  loading: props.loading,
  addVisible: false,
  editVisible: false
})
// defineExpose
defineExpose({
  onEdit,
  onUpdate
})
// computed
// 是否显示新增按钮
const showAddCpd = computed(() => {
  if (props.sysCode === SysCode.Admin && !props.tenantId) {
    return false
  }
  return !state.tree.length && state.ready && !props.readonly
})
// onMounted
onMounted(() => {
  state.dict = props.dict || {}
  // 获取路由树
  getList()
  // 设置选中的节点
  setCheckedKeys()
})
// watch
watch([() => props.sysCode, () => props.tenantId], () => {
  if (props.sysCode === SysCode.Admin && !props.tenantId) {
    state.tree = []
    const row = {
      sysCode: props.sysCode,
      tenantName: props.tenantName
    }
    emit('node-click', row)
  } else {
    getList()
  }
})
watch(
  () => props.dict,
  () => {
    state.dict = props.dict || {}
  }
)
watch(
  () => props.apiParams,
  () => {
    getList()
  }
)
watch(
  () => props.checkedKeys,
  () => {
    // 设置选中的节点
    setCheckedKeys()
  }
)
watch(
  () => props.loading,
  () => {
    state.loading = props.loading
  }
)
watch(
  () => props.over,
  () => {
    state.loading = false
  }
)
// 获取组织树
async function getList() {
  if (props.data) {
    return
  }
  let params = props.apiParams as any
  if (params) {
    if (base.isEmpty(params)) {
      if (!props.over) {
        state.loading = true
      }
      return
    }
  } else {
    params = {}
  }
  if (props.sysCode) {
    params.sysCode = props.sysCode
  }
  if (props.tenantId) {
    params.tenantId = props.tenantId
  }
  const path = Api.cs + 'ath/findOrgTree'
  state.loading = true
  const { data, dict } = await shiki.getData(path, params)
  state.loading = false
  state.ready = true
  if (data) {
    state.tree = data || []
    state.dict = dict || {}
    if (props.initRoot) {
      onNodeClick(state.tree[0])
    }
  }
}
// 新增
function onAdd(row?: any, orgType?: string) {
  if (row) {
    state.nodeData.level = Number(row.level) + 1
    state.nodeData.parentId = row.id
    state.nodeData.parentCode = row.orgCode
    state.nodeData.parentName = row.orgName
    state.nodeData.orgType = orgType as string
  } else {
    state.nodeData.level = 1
    state.nodeData.parentId = '0'
    state.nodeData.parentCode = '0'
    state.nodeData.parentName = '根节点'
    state.nodeData.orgType = '1'
  }
  state.addVisible = true
}
// 删除
async function onDel(row: any) {
  const msg = row.orgType === '2' ? t('deleteTips') : t('deleteAllTips')
  const status = await element.confirm(msg)
  if (status) {
    const path = Api.cs + 'ath/deleteOrg'
    const idList = [row.id]
    state.loading = true
    const code = await shiki.postCode(path, { idList })
    state.loading = false
    if (shiki.isSuccess(code)) {
      onUpdate(true)
    }
  }
}
// 更新
function onUpdate(isEmit?: boolean) {
  if (isEmit) {
    emit('update')
  }
  // 获取路由树
  getList()
  // 更新权限
  userStore.updateAuth()
}
// 编辑
function onEdit(row: any) {
  state.id = row.id
  state.editVisible = true
}
// 组织字典
function orgTypeDict(row: any) {
  const orgType = state.dict?.ORG_TYPE[row.orgType]
  return orgType
}
// 节点点击
function onNodeClick(row: any) {
  row.sysCode = props.sysCode
  row.tenantName = props.tenantName
  emit('node-click', row)
}
// 设置选中的节点
function setCheckedKeys() {
  const arr = props.checkedKeys?.map((item) => item.id || item)
  if (arr) {
    state.checkedKeys = []
    state.checkStrictly = true
    setTimeout(() => {
      state.checkStrictly = props.checkStrictly
      state.checkedKeys = arr
    }, 100)
  }
}
// 复选框选择
function onCheck(node: any, data: any) {
  if (props.showCheckbox && !props.multiple) {
    treeRef.value?.setCheckedKeys([])
    if (data.checkedKeys.length) {
      treeRef.value.setCheckedKeys([node.id])
      emit('check', node, data)
    } else {
      emit('check', null, [])
    }
  } else {
    emit('check', node, data)
  }
}
// 当复选框被点击的时候触发
function onCheckChange(node: any, checked: boolean, childChecked: boolean) {
  emit('check-change', node, checked, childChecked)
}
</script>

<style scoped lang="scss">
@import '../../../../style/var.scss';

.icon-user {
  color: $color-yellow;
}
.icon-flag {
  color: $color-purple;
}
</style>
