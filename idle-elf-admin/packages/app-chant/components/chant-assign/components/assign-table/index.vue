<template>
  <!-- 分配按钮 -->
  <div class="m-b-5">
    <el-button
      :disabled="!vModel.length"
      :loading="loading"
      type="primary"
      @click="onAssign">
      {{ buttonTextCpd }}
    </el-button>
  </div>
  <chant-table
    :list="vModel"
    :columns="columnsCpd"
    :column-width="120"
    :db-edit="false"
    :lang="lang"
    :show-selection="false"
    :sortable="false">
    <!-- 操作 -->
    <template #operate="{ row, index }">
      <chant-icon-button
        icon-type="delete"
        :tip-disabled="true"
        type="danger"
        @click="onDelete(row, index)">
      </chant-icon-button>
    </template>
  </chant-table>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'
import { AssignKind, AssignOperateType, AssignType } from '@chant/enum'
import { bus } from '@chant/share'
import { shiki, Api } from '@chant/api'
import { InfoData } from '../../share'
import workplaceColumns from './columns/workplace'
import departmentColumns from './columns/department'
import personalColumns from './columns/personal'
import customerColumns from './columns/customer'
import lang from './share/lang'

// props
const props = defineProps<{
  modelValue: any[]
  infoData?: InfoData // data
  totalNum: number // 已转移/分配案件数
  totalEntrustAmount: number // 已转移/分配委案件总金额
  assignId: string // 分配id
  assignKind: AssignKind // 分配种类
  assignMode?: string // 分配方式
  assignStockFlag?: string // 是否考虑存量
  assignPreference?: string // 分配偏好
  valiRef: any // 校验ref
}>()
// emit
const emit = defineEmits([
  'update:modelValue',
  'update:totalNum', // 已转移/分配案件数
  'update:totalEntrustAmount', // 已转移/分配委案件总金额
  'update:assignId' // 转移/分配id
])
// VModel
const vModel = useVModel(props, 'modelValue', emit)
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// var
const { assignOperateType, assignType } = props.infoData || {}
const isCase = props.assignKind === AssignKind.Case
const isCustomer = props.assignKind === AssignKind.Customer
// ref
const loading = ref(false)
// computed
const columnsCpd = computed(() => {
  if (isCustomer) {
    return customerColumns
  }
  const map = {
    13: workplaceColumns,
    15: departmentColumns,
    16: personalColumns
  }
  if (assignType) {
    return map[assignType]
  }
})
const buttonTextCpd = computed(() => {
  const map = {
    assign: tg('button.assign'),
    transfer: tg('button.transfer')
  }
  return map[assignOperateType!]
})
// 分配
async function onAssign() {
  const status = await props.valiRef.validate()
  if (!status) {
    return
  }
  const params = {
    assignType,
    hierarchy: props.infoData?.hierarchy,
    caseDataType: props.infoData?.caseDataType,
    idList: props.infoData?.idList,
    allFlag: props.infoData?.allFlag,
    searchAllForm: props.infoData?.searchAllForm,
    assignTargetList: vModel.value,
    assignMode: props.assignMode,
    assignStockFlag: props.assignStockFlag,
    assignPreference: props.assignPreference
  }
  let path = ''
  // 案件种类-案件
  if (props.assignKind === AssignKind.Case) {
    // 分配
    if (assignOperateType === AssignOperateType.Assign) {
      path = Api.crmmu + 'wod/v2/prepareAssignCase'
    }
    // 转移
    if (assignOperateType === AssignOperateType.Transfer) {
      path = Api.crmmu + 'wod/v2/prepareTransferCase'
    }
  }
  // 案件种类-客户
  if (props.assignKind === AssignKind.Customer) {
    // 分配
    if (assignOperateType === AssignOperateType.Assign) {
      path = props.infoData?.prepareAssignUrl!
    }
    // 转移
    if (assignOperateType === AssignOperateType.Transfer) {
      path = props.infoData?.prepareTransferUrl!
    }
  }
  loading.value = true
  const { data } = await shiki.postData(path, params)
  loading.value = false
  if (data) {
    const map = {
      13: 'targetTenantId',
      15: 'targetOrgId',
      16: 'targetUserInfoId'
    }
    vModel.value = vModel.value.map((item) => {
      const idKey = assignType && item[map[assignType]]
      const row = data.prepareAssignDetailMap[idKey]
      if (row) {
        row.assignIdList = row.idList
        return { ...item, ...row }
      } else {
        return item
      }
    })
    emit('update:totalNum', data.prepareAssignTotalNum)
    emit('update:totalEntrustAmount', data.prepareAssignTotalEntrustAmount || 0)
    emit('update:assignId', data.assignId)
  }
}
// 删除
function onDelete(row: any, index: number) {
  vModel.value.splice(index, 1)
  // 职场
  if (assignType === AssignType.Workplace) {
    bus.emit('WORKPLACE_ASSIGN_TABLE_DELETE', row)
  }
  // 部门
  if (assignType === AssignType.Department) {
    bus.emit('DEPARTMENT_ASSIGN_TABLE_DELETE', row)
  }
  // 个人
  if (assignType === AssignType.Personal) {
    bus.emit('EMPLOYEE_ASSIGN_TABLE_DELETE', row)
  }
}
</script>

<style scoped lang="scss"></style>
