<template>
  <div class="target-choice">
    <el-form ref="formRef" :model="vModel" :rules="rules" label-width="100px">
      <template v-if="isCase">
        <!-- 部门 -->
        <chant-form-item
          v-if="showDepartment"
          prop="targetTenantId"
          :label="t('department')">
          <div>{{ props.infoData?.deptName }}</div>
        </chant-form-item>
        <!-- 职场业务类型 -->
        <chant-form-item :label="t('ccWorkplaceBizType')">
          <chant-select
            v-model="state.ccWorkplaceBizType"
            :data="state.ccWorkplaceBizTypeDict"
            :placeholder="t('ccWorkplaceBizType')"
            @change="onWorkplaceBizType">
          </chant-select>
        </chant-form-item>
      </template>
      <!-- 选择职场 -->
      <chant-form-item
        v-if="showWorkplace"
        prop="targetTenantId"
        :label="t('workplace')">
        <el-select
          v-model="vModel.targetTenantId"
          :placeholder="tg('tips.select') + t('workplace')"
          @change="onWorkplaceChange">
          <el-option
            v-for="item in state.workplaceList"
            :key="item.key"
            :label="item.tenantName"
            :value="item.id">
          </el-option>
        </el-select>
      </chant-form-item>
      <template v-if="isCase">
        <!-- 分配/转移方式 -->
        <chant-form-item
          prop="assignMode"
          :label="
            assignOperateType === AssignOperateType.Transfer
              ? t('transferType')
              : t('assignType')
          ">
          <chant-select
            v-model="vModel.assignMode"
            :data="props.infoData?.dict?.AssignModeEnum"
            :placeholder="t('assignType')">
          </chant-select>
        </chant-form-item>
        <!-- 分配编好 -->
        <!-- <chant-form-item
        v-if="props.infoData.assignType !== AssignType.Personal"
        :label="t('assignPreference')">
        <chant-select
          v-model="vModel.assignPreference"
          :data="props.infoData.dict?.AssignPreferenceEnum"
          :placeholder="t('assignPreference')">
        </chant-select>
      </chant-form-item> -->
        <!-- 是否考虑存量 -->
        <chant-form-item
          v-if="props.infoData?.assignType === AssignType.Personal"
          prop="assignStockFlag"
          :label="t('assignStockFlag')">
          <chant-select
            v-model="vModel.assignStockFlag"
            :data="props.infoData.dict?.StockFlagEnum"
            :placeholder="t('assignStockFlag')">
          </chant-select>
        </chant-form-item>
      </template>
    </el-form>
    <el-divider content-position="left">
      {{ title }}
    </el-divider>
    <div
      v-if="assignType !== AssignType.Personal"
      v-loading="state.loading"
      class="checkbox-box">
      <!-- 选择职场 -->
      <el-checkbox-group
        v-if="assignType === AssignType.Workplace"
        v-model="state.workplaceCheckedList"
        :max="caseDataType === CaseDataType.CaseBatch ? 1 : undefined"
        @change="onWorkplaceCheck">
        <div v-for="item in state.workplaceList">
          <el-checkbox :label="item">{{ item.tenantName }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <!-- 选择部门 -->
      <el-checkbox-group
        v-if="assignType === AssignType.Department"
        v-model="state.orgCheckedList"
        @change="onDepartmenChange">
        <div v-for="item in state.orgList">
          <el-checkbox :label="item">
            {{ item.name }}
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
    <!-- 选择员工 -->
    <div v-if="assignType === AssignType.Personal" class="employee-box">
      <div v-if="!showDepartment" class="left">
        <chant-tree
          :data="state.orgTree"
          :expand-on-click-node="false"
          highlight-current
          :loading="state.orgTreeLoading"
          default-expand-all
          :props="{ label: 'name' }"
          @node-click="onOrgNodeClick">
        </chant-tree>
      </div>
      <div class="right">
        <div class="table-header">
          <div class="table-item">{{ t('employeeAccount') }}</div>
          <div class="table-item">{{ t('employeeName') }}</div>
        </div>
        <div v-loading="userState.loading" class="table-container">
          <div
            v-for="item in userState.list"
            :key="item.id"
            :class="{ active: item._active }"
            class="table-row"
            @click="onUserPick(item)">
            <div class="table-item">
              {{ item.defaultLoginName }}
            </div>
            <div class="table-item">{{ item.userInfoName }}</div>
          </div>
          <div v-if="!userState.list.length" class="gravity-center">
            {{ tg('common.notData') }}
          </div>
        </div>
        <chant-pagination
          class="employ-pagination"
          v-model="userState.pages"
          layout="total, prev, pager, next"
          :total="userState.total"
          @change="getUserInfo">
        </chant-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { bus, core, element, shiki, useLister, useUserStore, Api } from '@chant'
import {
  AssignKind,
  AssignOperateType,
  AssignType,
  CaseDataType,
  WorkplaceTypeEnum
} from '@chant/enum'
import { lang, InfoData } from '../share'
import ChantSelect from '../../ChantSelect.vue'

// props
const props = defineProps<{
  assignKind?: AssignKind // 分配种类
  infoData?: InfoData // data
  modelValue: {
    assignTargetList: any[] // 选择的数据
    targetTenantId?: string // 职场id
    assignMode?: string // 分配方式
    assignPreference?: string // 分配偏好
    assignStockFlag?: string // 是否考虑存量
  }
  typeText?: string // 类型文字
}>()
// emit
const emit = defineEmits(['change', 'update:modelValue'])
// VModel
const vModel = useVModel(props, 'modelValue', emit)
// i18n
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
// lister
const lister = useLister()
// store
const userStore = useUserStore()
// var
const { assignOperateType, assignType, caseDataType, showDepartment } =
  props.infoData || {}
const workplaceType = userStore.workplaceType // 职场类型
const isHeadquarters = workplaceType === WorkplaceTypeEnum.Headquarters // 是否为集团总部
const isCase = props.assignKind === AssignKind.Case
const isCustomer = props.assignKind === AssignKind.Customer
const isPsa = core.isPsa()
const isPta = core.isPta()
// ref
const formRef = ref()
// state
const state = reactive({
  workplaceList: [] as any[], // 职场列表
  workplaceCheckedList: [] as any[], // 选中的职场列表
  orgList: [] as any[], // 部门列表
  orgCheckedList: [] as any[], // 选中的部门列表
  orgTree: [] as any, // 部门tree
  ccWorkplaceBizType: '11', // 职场业务类型 电催
  ccWorkplaceBizTypeDict: {}, // 职场业务类型字典
  orgTreeLoading: false,
  employeeLoading: false,
  loading: false
})
const userState = reactive({
  ...lister.state
})
const rules = reactive({
  targetTenantId: [
    {
      required: true,
      message: t('workplace') + tg('tips.required')
    }
  ],
  assignMode: [
    {
      required: true,
      message: t('assignType') + tg('tips.required')
    }
  ],
  assignStockFlag: [
    {
      required: true,
      message: t('assignStockFlag') + tg('tips.required')
    }
  ]
})
// defineExpose
defineExpose({
  validate // form校验方法
})
// computed
const showWorkplace = computed(() => {
  if (isCustomer) {
    return false
  }
  if (isPta && !isHeadquarters) {
    return false
  }
  const isWorkplace = assignType === AssignType.Workplace
  return !isWorkplace && !showDepartment
})
const title = computed(() => {
  const isPersonal = assignType === AssignType.Personal
  const label = isPersonal ? t('employee') : props.typeText
  return tg('tips.select') + label
})
// bus
// 职场分配列表删除事件
bus.on('WORKPLACE_ASSIGN_TABLE_DELETE', (row: any) => {
  const index = state.workplaceCheckedList.findIndex(
    (item) => item.id === row.targetTenantId
  )
  state.workplaceCheckedList.splice(index, 1)
})
// 部门分配列表删除事件
bus.on('DEPARTMENT_ASSIGN_TABLE_DELETE', (row: any) => {
  const index = state.orgCheckedList.findIndex(
    (item) => item.id === row.targetOrgId
  )
  state.orgCheckedList.splice(index, 1)
})
// 员工分配列表删除事件
bus.on('EMPLOYEE_ASSIGN_TABLE_DELETE', (row: any) => {
  const index = userState.list.findIndex(
    (item) => item.id === row.targetUserInfoId
  )
  userState.list[index]._active = false
})
// init
// 固定部门的分配
if (showDepartment) {
  const infoData = props.infoData
  vModel.value.targetTenantId = infoData?.tenantId
  userState.query.tenantId = infoData?.tenantId
  userState.query.orgId = infoData?.deptId
  // 获取员工列表
  getUserInfo()
} else {
  if (isPsa || (isCase && isPta && isHeadquarters)) {
    // 获取职场列表
    getWorkplace()
  } else {
    vModel.value.targetTenantId = userStore.tenantId
    onWorkplaceChange(userStore.tenantId)
  }
}
// 获取职场列表
async function getWorkplace() {
  const path = Api.cs + 'ath/findMyWorkPlace'
  state.loading = true
  const { data, dict } = await shiki.getData(path, {
    ccWorkplaceBizType: state.ccWorkplaceBizType,
    pageNum: 1,
    pageSize: 100
  })
  state.loading = false
  if (data) {
    state.ccWorkplaceBizTypeDict = dict.WorkplaceBizTypeEnum
    state.workplaceList = data.pageData || []
  } else {
    state.workplaceList = []
  }
}
// 获取部门列表
async function getOrg(tenantId: string) {
  const path = Api.cs + 'ath/getOrgTreeJson'
  state.loading = true
  const { data } = await shiki.getData(path, { tenantId })
  state.loading = false
  if (data) {
    state.orgList = data
  } else {
    state.orgList = []
  }
}
// 获取部门tree
async function getOrgTree(tenantId: string) {
  const path = Api.cs + 'ath/getOrgPositionTreeJson'
  state.orgTreeLoading = true
  const { data } = await shiki.getData(path, { tenantId })
  state.orgTreeLoading = false
  if (data) {
    state.orgTree = [data] || []
  } else {
    state.orgTree = []
  }
}
// 获取员工列表
async function getUserInfo() {
  const path = Api.cs + 'ath/getOrgUser'
  const status = await lister.getData(path, userState)
  // 添加选中样式
  if (status) {
    const assignTargetList = vModel.value.assignTargetList
    userState.list.forEach((item) => {
      const row = assignTargetList.find(
        (child) => child.targetUserInfoId === item.id
      )
      if (row) {
        item._active = true
      }
    })
  }
}
// 职场选择
function onWorkplaceCheck(rows: any[]) {
  // const assignNum = average(rows.length)
  vModel.value.assignTargetList = rows.map((item) => {
    return {
      targetTenantId: item.id,
      targetCode: item.tenantCode,
      targetName: item.tenantName
      // assignNum
    }
  })
}
// 部门选择
function onDepartmenChange(rows: any[]) {
  // const assignNum = average(rows.length)
  vModel.value.assignTargetList = rows.map((item) => {
    return {
      targetTenantId: vModel.value.targetTenantId,
      targetOrgId: item.id,
      targetOrgCode: item.code,
      targetOrgName: item.name
      // assignNum
    }
  })
}
// 员工选择
function onUserPick(row: any) {
  const assignTargetList = vModel.value.assignTargetList
  const index = assignTargetList.findIndex(
    (item) => item.targetUserInfoId === row.id && !row._active
  )
  if (index >= 0) {
    ElMessage.warning(t('repeat'))
    return
  }
  row._active = !row._active
  if (row._active) {
    assignTargetList.push({
      targetTenantId: vModel.value.targetTenantId,
      targetOrgId: row.dept.id,
      targetOrgCode: row.dept.orgCode,
      targetOrgName: row.dept.orgName,
      postOrgName: row.org.orgName,
      targetUserInfoId: row.id,
      targetUserInfoName: row.userInfoName
    })
  } else {
    const index = assignTargetList.findIndex(
      (item) => item.targetUserInfoId === row.id
    )
    if (index >= 0) {
      assignTargetList.splice(index, 1)
    }
  }
}
// 数量分配
// function average(total: number) {
//   const count = props.infoData.totalCaseNum
//   const value = ((count || 0) / total).toFixed(0)
//   return parseInt(value)
// }
// 职场业务类型选择
function onWorkplaceBizType() {
  state.workplaceCheckedList = []
  vModel.value.assignTargetList = []
  vModel.value.targetTenantId = ''
  state.orgList = []
  state.orgTree = []
  userState.list = []
  getWorkplace()
}
// 职场选择
function onWorkplaceChange(id: string) {
  // 部门
  if (assignType === AssignType.Department) {
    getOrg(id)
  }
  // 个人
  if (assignType === AssignType.Personal) {
    getOrgTree(id)
  }
  vModel.value.assignTargetList = []
}
// 部门节点点击
function onOrgNodeClick(row: any) {
  userState.query.tenantId = vModel.value.targetTenantId
  userState.query.orgId = row.id
  // 获取员工列表
  getUserInfo()
}
// 表单校验
async function validate() {
  return await element.validate(formRef.value as any)
}
</script>

<style scoped lang="scss">
@import '../../../style/mixin.scss';
@import '../../../style/var.scss';

.target-choice {
  display: flex;
  flex-direction: column;
  width: 480px;
  .checkbox-box {
    @include scroll-beautify;
    flex: 1;
    padding: 10px 0 10px 20px;
  }
  .employee-box {
    flex: 1;
    display: flex;
    overflow: hidden;
    margin-top: 10px;
    .left {
      width: 180px;
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 5px;
      .table-header {
        background-color: $color-gray;
        display: flex;
        align-items: center;
        font-size: 14px;
      }
      .table-container {
        flex: 1;
        overflow: auto;
        border-left: 1px solid $color-gray3;
        border-right: 1px solid $color-gray3;
        border-bottom: 1px solid $color-gray3;
        position: relative;
        .table-row {
          cursor: pointer;
          &.active {
            background-color: $color-base;
            color: $color-white;
          }
        }
        .gravity-center {
          color: $color-gray4;
        }
      }
      .table-row {
        border-bottom: 1px solid $color-gray3;
        display: flex;
        align-items: center;
        font-size: 12px;
      }
      .table-item {
        flex: 1;
        padding: 10px 0;
        text-align: center;
      }
      .table-item + .table-item {
        border-left: 1px solid $color-gray3;
      }
      .employ-pagination {
        margin-top: 10px;
        padding: 5px 0;
      }
    }
  }
}
</style>
