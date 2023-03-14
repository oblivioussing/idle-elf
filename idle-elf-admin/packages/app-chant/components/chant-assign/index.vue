<template>
  <chant-dialog
    v-model="vModel"
    :title="titleCpd"
    :options="['close', 'save']"
    :loading="state.loading"
    type="form"
    width="1400px"
    @save="onSave">
    <div class="assign-box">
      <!-- 目标选择 -->
      <target-choice
        ref="targetChoiceRef"
        v-model="state.form"
        :assign-kind="props.assignKind"
        :info-data="props.infoData"
        :type-text="typeTextCpd">
      </target-choice>
      <!-- 分配/转移操作 -->
      <div class="distribution">
        <div v-if="isCase" class="statistics">
          <!-- 可转移/分配案件数 -->
          <div class="statistics-item">
            {{ canCpd }}{{ t('totalCaseNum') }}:
            {{ props.infoData?.totalCaseNum }}
          </div>
          <!-- 可转移/分配委案件总金额 -->
          <div class="statistics-item">
            {{ canCpd }}{{ t('totalEntrustAmount') }}:
            {{ props.infoData?.totalEntrustAmount }}{{ tg('unit.yuan') }}
          </div>
          <!-- 已转移/分配案件数 -->
          <div class="statistics-item">
            {{ alreadyCpd }}{{ t('totalCaseNum') }}:
            {{ state.prepareAssignTotalNum }}
          </div>
          <!-- 已转移/分配委案件总金额 -->
          <div class="statistics-item">
            {{ alreadyCpd }}{{ t('totalEntrustAmount') }}:
            {{ state.prepareAssignTotalEntrustAmount }}{{ tg('unit.yuan') }}
          </div>
        </div>
        <!-- 分配/转移table -->
        <assign-table
          v-model="state.form.assignTargetList"
          v-model:totalNum="state.prepareAssignTotalNum"
          v-model:totalEntrustAmount="state.prepareAssignTotalEntrustAmount"
          v-model:assignId="state.form.assignId"
          :info-data="props.infoData"
          :assign-kind="props.assignKind"
          :assign-mode="state.form.assignMode"
          :assign-stock-flag="state.form.assignStockFlag"
          :assign-preference="state.form.assignPreference"
          :vali-ref="targetChoiceRef">
        </assign-table>
      </div>
    </div>
  </chant-dialog>
  <!-- 自动回收 -->
  <auto-recover
    v-if="state.recoverVisible"
    v-model="state.recoverVisible"
    @update="onRecoverUpdate">
  </auto-recover>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { AssignKind, AssignType, AssignOperateType } from '@chant/enum'
import { Api } from '@chant/api'
import { core } from '@chant/share'
import { useFormer, useDialoger } from '@chant/use'
import { lang, InfoData } from './share'
import TargetChoice from './components/TargetChoice.vue' // 目标选择
import AssignTable from './components/assign-table/index.vue' // 分配table
import AutoRecover from './components/auto-recover/index.vue' // 自动回收

interface Props {
  assignKind?: AssignKind // 分配种类
  infoData?: InfoData // data
  modelValue: boolean // visible
}
// props
const props = withDefaults(defineProps<Props>(), {
  assignKind: AssignKind.Case // 分配种类-案件
})
// emit
const emit = defineEmits(['change', 'update:modelValue', 'update'])
// VModel
const vModel = useVModel(props, 'modelValue', emit)
// i18n
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
// use
const former = useFormer()
const dialoger = useDialoger()
// var
const assignOperateType = props.infoData?.assignOperateType // 操作类型
const isAssign = assignOperateType === AssignOperateType.Assign // 是否为分配
const isTranser = assignOperateType === AssignOperateType.Transfer // 是否为转移
const isCase = props.assignKind === AssignKind.Case
// ref
const targetChoiceRef = ref()
// state
const state = reactive({
  ...former.state,
  lang,
  prepareAssignTotalNum: 0, // 已转移/分配案件数
  prepareAssignTotalEntrustAmount: 0, // 已转移/分配委案件总金额
  form: {
    hierarchy: props.infoData?.hierarchy, // 层级
    allFlag: props.infoData?.allFlag, // 是否全选
    idList: props.infoData?.idList, // 选中的列表id
    assignType: props.infoData?.assignType, // 分配类型
    assignTargetList: [] as any[], // 选择的数据
    targetList: [] as any[], // 选择的数据
    assignMode: '', // 分配方式
    assignId: '', // 分配id
    assignStockFlag: '', // 是否考虑存量
    assignPreference: '', // 分配偏好
    ...props.infoData?.defaultValue
  },
  recoverVisible: false // 自动回收visible
})
// computed
// 分配类型text
const typeTextCpd = computed(() => {
  const assignType = props.infoData?.assignType
  let label = ''
  // 职场
  if (assignType === AssignType.Workplace) {
    label = t('workplace')
  }
  // 部门
  else if (assignType === AssignType.Department) {
    label = t('department')
  }
  // 个人
  else if (assignType === AssignType.Personal) {
    label = t('personal')
  }
  return label
})
// 操作类型text
const assignOperateTypeTextCpd = computed(() => {
  const map = {
    assign: tg('button.assign'),
    transfer: tg('button.transfer')
  }
  return map[assignOperateType!]
})
// title
const titleCpd = computed(() => {
  return assignOperateTypeTextCpd.value + t('to') + typeTextCpd.value
})
// 可转移/分配
const canCpd = computed(() => {
  const map = {
    assign: t('assignable'),
    transfer: t('transferable')
  }
  return map[assignOperateType!]
})
// 已转移/分配
const alreadyCpd = computed(() => {
  const map = {
    assign: t('assigned'),
    transfer: t('transfered')
  }
  return map[assignOperateType!]
})
// 保存
async function onSave() {
  // 条件校验
  let status = await targetChoiceRef.value.validate()
  if (!status) {
    return
  }
  const typeMsg = assignOperateTypeTextCpd.value
  const assignTargetList = state.form.assignTargetList
  if (!assignTargetList.length) {
    // 请先选择数据
    ElMessage.error(t('notData'))
    return
  }
  status = state.prepareAssignTotalNum > 0
  if (!status) {
    // 请先分配/转移
    ElMessage.error(`${t('please')}${typeMsg}`)
    return
  }
  // pas,案件种类为案件,并且是分配或转移需要填写自动回收数据
  const isCase = props.assignKind === AssignKind.Case
  if (core.isPsa() && isCase && (isAssign || isTranser)) {
    state.recoverVisible = true
  } else {
    submit()
  }
}
// 自动回收信息修改
function onRecoverUpdate(row: any) {
  Object.assign(state.form, row)
  submit()
}
// 提交
function submit() {
  // 保存接口路径
  const path = getSaveApi()
  dialoger.save(path, state)
}
// 保存接口路径
function getSaveApi() {
  let path = ''
  // 案件种类-案件
  if (props.assignKind === AssignKind.Case) {
    // 分配
    if (isAssign) {
      path = Api.crmmu + 'wod/v2/submitPrepareAssignCase'
    }
    // 转移
    if (isTranser) {
      path = Api.crmmu + 'wod/v2/submitPrepareTransferCase'
    }
  }
  // 案件种类-客户
  if (props.assignKind === AssignKind.Customer) {
    // 分配
    if (isAssign) {
      path = Api.crmmu + 'csr/assignCustomer'
    }
    // 转移
    if (isTranser) {
      path = Api.crmmu + 'csr/userCustomerTransferToOtherUser'
    }
  }
  return path
}
</script>

<style scoped lang="scss">
.assign-box {
  flex: 1;
  display: flex;
  overflow: hidden;
  .distribution {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    overflow: hidden;
    .statistics {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 5px;
      .statistics-item {
        width: 50%;
      }
    }
  }
}
</style>
