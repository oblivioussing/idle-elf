<template>
  <el-tree
    ref="treeRef"
    v-loading="state.loading"
    :check-strictly="state.checkStrictly"
    :current-node-key="state.currentNodeKey"
    :default-checked-keys="state.checkedKeys"
    :data="props.data || state.tree"
    :default-expand-all="props.defaultExpandAll"
    :default-expanded-keys="props.expandRoot ? [state.rootId] : []"
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
            <div>{{ data.titleZh }}</div>
          </div>
        </div>
        <div v-if="!props.readonly" class="button-box">
          <!-- 导出功能 -->
          <el-tooltip
            v-if="
              data.funType !== FunType.SecondLevelMenu &&
              data.funType !== FunType.Page
            "
            effect="dark"
            :content="tg('button.export') + t('function')"
            placement="bottom">
            <el-button
              @click="onExportRouter(data)"
              type="text"
              :icon="Download">
            </el-button>
          </el-tooltip>
          <!-- 导出功能与功能接口关系 -->
          <!-- <el-tooltip
            effect="dark"
            :content="tg('button.export') + t('functionAndInterface')"
            placement="bottom">
            <el-button
              @click="onExportFunInterfaceByFun(data)"
              type="text"
              :icon="Download">
            </el-button>
          </el-tooltip> -->
          <!-- 新增一级菜单 -->
          <el-button
            v-if="data.funType === FunType.System"
            @click.stop="onAdd(data)"
            type="text"
            :icon="Plus">
          </el-button>
          <!-- 新增二级菜单 -->
          <el-button
            v-if="
              data.funType === FunType.FirstLevelMenu ||
              data.funType === FunType.Global
            "
            @click.stop="onAdd(data)"
            type="text"
            :icon="Plus">
          </el-button>
          <!-- 删除 -->
          <el-button
            v-if="data.funType !== FunType.System"
            @click.stop="onDel(data)"
            type="text"
            :icon="Delete"
            class="red">
          </el-button>
          <!-- 编辑 -->
          <el-button @click.stop="onEdit(data)" type="text" :icon="Edit">
          </el-button>
        </div>
        <!-- slot -->
        <slot :row="data"></slot>
      </div>
    </template>
  </el-tree>
  <el-button
    v-if="!state.tree.length && state.ready && !props.readonly"
    @click="onAdd()"
    type="primary"
    class="gravity-center">
    {{ t('add') }}
  </el-button>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete, Download, Edit, Plus } from '@element-plus/icons-vue'
import { shiki, Api, BlobType } from '@chant/api'
import { FunType, PagePathEnum } from '@chant/enum'
import { element } from '@chant/plugs'
import { useUserStore } from '@chant/store'
import { useChaoser } from '@chant/use'

interface Props {
  apiParams?: {
    searchFunType?: string // 10-查询全部 11-根据业务线和数据权限查询
  } // 接口查询参数
  checkedKeys?: any[] // 选中的节点
  checkStrictly?: boolean // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
  data?: any[] // 展示数据
  defaultExpandAll?: boolean // 是否默认展开所有节点
  expandRoot?: boolean // 展开根节点
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
}
// props
const props = withDefaults(defineProps<Props>(), {
  defaultExpandAll: true
})
// emit
const emit = defineEmits(['check', 'check-change', 'node-click', 'update'])
// use
const chaoser = useChaoser()
// store
const userStore = useUserStore()
// i18n
const { t } = useI18n({
  messages: {
    en: {
      add: 'function add',
      deleteAllTips:
        'This operation will permanently delete this function node and subordinate functions. Do you want to continue?',
      function: ' function',
      functionAndInterface: ' function and function interface relationship'
    },
    zh: {
      add: '功能新增',
      deleteAllTips: '此操作将永久删除该功能节点以及下属功能, 是否继续?',
      function: '功能',
      functionAndInterface: '功能与功能接口关系'
    }
  }
})
const { t: tg } = useI18n({ useScope: 'global' })
// ref
const treeRef = ref()
// state
const state = reactive({
  checkStrictly: props.checkStrictly,
  checkedKeys: [] as any[],
  tree: [],
  dict: {} as any,
  defaultValue: {},
  id: '',
  rootId: '', // 根节点id
  ready: false,
  currentNodeKey: '',
  loading: props.loading
})
// defineExpose
defineExpose({
  treeRef,
  onEdit,
  onUpdate
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
  getList()
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
// 获取路由树
async function getList() {
  if (props.data) {
    return
  }
  let params = props.apiParams as any
  // apiParams存在,但searchFunType不存在则加载loading
  if (params) {
    if (!params?.searchFunType) {
      if (!props.over) {
        state.loading = true
      }
      return
    }
  } else {
    params = { searchFunType: '10' }
  }
  if (props.sysCode) {
    params.sysCode = props.sysCode
  }
  if (props.tenantId) {
    params.tenantId = props.tenantId
  }
  const path = Api.cs + 'ath/findMenuTree'
  state.loading = true
  const { data, dict, defaultValue } = await shiki.getData(path, params)
  state.loading = false
  state.ready = true
  if (data?.tree?.length) {
    state.tree = data.tree || []
    const rootNode = state.tree[0] as any
    state.rootId = rootNode?.id
    state.dict = dict || {}
    state.defaultValue = defaultValue || {}
    if (state.currentNodeKey) {
      setTimeout(() => {
        treeRef.value.setCurrentKey(state.currentNodeKey)
      }, 0)
    } else if (props.initRoot) {
      onNodeClick(rootNode)
    }
  }
}
// 导出功能
function onExportRouter(row: any) {
  const path = Api.cs + 'ath/downloadFun'
  const config = {
    blobType: BlobType.Text,
    filename: `${row.titleZh}.json`,
    params: { id: row.id }
  }
  shiki.download(path, config)
}
// 导出功能与功能接口关系
function onExportFunInterfaceByFun(row: any) {
  const path = Api.cs + 'ath/exportFunInterfaceByFun'
  const config = {
    blobType: BlobType.Text,
    filename: `${row.titleZh}${t('functionAndInterface')}.json`,
    params: { id: row.id }
  }
  shiki.download(path, config)
}
// 新增
function onAdd(row?: any) {
  const params = {
    parentId: row?.id,
    parentName: row?.titleZh
  }
  chaoser.push({ path: PagePathEnum.RouteAdd, query: params })
}
// 编辑
function onEdit(row: any) {
  chaoser.push({ path: PagePathEnum.RouteEdit, query: { id: row.id } })
}
// 删除
async function onDel(row: any) {
  const status = await element.confirm(t('deleteAllTips'))
  if (status) {
    const path = Api.cs + 'ath/deleteFun'
    const idList = [row.id]
    state.loading = true
    const code = await shiki.postCode(path, { idList })
    state.loading = false
    if (shiki.isSuccess(code)) {
      if (row.id === state.currentNodeKey) {
        state.currentNodeKey = ''
      }
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
// 节点点击
function onNodeClick(row: any) {
  state.currentNodeKey = row.id
  row.sysCode = props.sysCode
  row.tenantName = props.tenantName
  emit('node-click', row)
}
// 设置选中的节点
function setCheckedKeys() {
  const arr = props.checkedKeys?.map((item) => item.funId || item.id || item)
  if (arr?.length) {
    state.checkedKeys = []
    state.checkStrictly = true
    setTimeout(() => {
      state.checkedKeys = arr
      state.checkStrictly = props.checkStrictly
    }, 1000)
  }
}
// 复选框选择
function onCheck(node: any, nodes: any) {
  emit('check', node, nodes)
}
// 当复选框被点击的时候触发
function onCheckChange(node: any, checked: boolean, childChecked: boolean) {
  emit('check-change', node, checked, childChecked)
}
</script>

<style scoped lang="scss">
.division {
  padding: 0 3px;
}
.ellipsis-1 {
  max-width: 150px;
}
</style>
