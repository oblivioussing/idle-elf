import { App, defineAsyncComponent } from 'vue'

const ChantAudioPlayer = defineAsyncComponent(
  () => import('./ChantAudioPlayer.vue')
)
const ChantAssign = defineAsyncComponent(
  () => import('./chant-assign/index.vue')
)
const ChantAssignType = defineAsyncComponent(
  () => import('./chant-assign/AssignType.vue')
)
const ChantBasePicker = defineAsyncComponent(
  () => import('./ChantBasePicker.vue')
)
const ChantCall = defineAsyncComponent(() => import('./ChantCall.vue'))
const ChantCasePicker = defineAsyncComponent(
  () => import('./chant-case-picker/index.vue')
)
const ChantCharts = defineAsyncComponent(() => import('./ChantCharts.vue'))
const ChantChat = defineAsyncComponent(() => import('./chant-chat/index.vue'))
const ChantCustomerPicker = defineAsyncComponent(
  () => import('./chant-customer-picker/index.vue')
)
const ChantDepartmentPicker = defineAsyncComponent(
  () => import('./chant-department-picker/index.vue')
)
const ChantDialog = defineAsyncComponent(() => import('./ChantDialog.vue'))
const ChantForm = defineAsyncComponent(() => import('./ChantForm.vue'))
const ChantFormItem = defineAsyncComponent(() => import('./ChantFormItem.vue'))
const ChantIconButton = defineAsyncComponent(
  () => import('./ChantIconButton.vue')
)
const ChantIconPicker = defineAsyncComponent(
  () => import('./ChantIconPicker.vue')
)
const ChantInput = defineAsyncComponent(() => import('./ChantInput.vue'))
const ChantOperation = defineAsyncComponent(
  () => import('./chant-operation/index.vue')
)
const ChantPagination = defineAsyncComponent(
  () => import('./ChantPagination.vue')
)
const ChantPickerButton = defineAsyncComponent(
  () => import('./ChantPickerButton.vue')
)
const ChantProductPicker = defineAsyncComponent(
  () => import('./chant-product-picker/index.vue')
)
const ChantRadio = defineAsyncComponent(() => import('./ChantRadio.vue'))
const ChantSearchItem = defineAsyncComponent(
  () => import('./ChantSearchItem.vue')
)
const ChantSelect = defineAsyncComponent(() => import('./ChantSelect.vue'))
const ChantSpeechPicker = defineAsyncComponent(
  () => import('./chant-speech-picker/index.vue')
)
const ChantTaskPicker = defineAsyncComponent(
  () => import('./chant-task-picker/index.vue')
)
const ChantSysTenant = defineAsyncComponent(
  () => import('./ChantSysTenant.vue')
)
const ChantTab = defineAsyncComponent(() => import('./chant-tab/Tab.vue'))
const ChantTabs = defineAsyncComponent(() => import('./chant-tab/Tabs.vue'))
const ChantTable = defineAsyncComponent(() => import('./ChantTable.vue'))
const ChantTenantPicker = defineAsyncComponent(
  () => import('./chant-tenant-picker/index.vue')
)
const ChantTemplateDownload = defineAsyncComponent(
  () => import('./ChantTemplateDownload.vue')
)
const ChantTree = defineAsyncComponent(() => import('./chant-tree/index.vue'))
const ChantUpload = defineAsyncComponent(
  () => import('./chant-upload/index.vue')
)
const ChantUploadInline = defineAsyncComponent(
  () => import('./chant-upload/inline.vue')
)
const ChantUploadSingle = defineAsyncComponent(
  () => import('./chant-upload/single.vue')
)
const ChantUserPicker = defineAsyncComponent(
  () => import('./chant-user-picker/index.vue')
)

import './components'

function components(app: App<Element>) {
  app.component('ChantAudioPlayer', ChantAudioPlayer)
  app.component('ChantAssign', ChantAssign)
  app.component('ChantAssignType', ChantAssignType)
  app.component('ChantBasePicker', ChantBasePicker)
  app.component('ChantCall', ChantCall)
  app.component('ChantCasePicker', ChantCasePicker)
  app.component('ChantCharts', ChantCharts)
  app.component('ChantChat', ChantChat)
  app.component('ChantCustomerPicker', ChantCustomerPicker)
  app.component('ChantDepartmentPicker', ChantDepartmentPicker)
  app.component('ChantDialog', ChantDialog)
  app.component('ChantForm', ChantForm)
  app.component('ChantFormItem', ChantFormItem)
  app.component('ChantIconButton', ChantIconButton)
  app.component('ChantIconPicker', ChantIconPicker)
  app.component('ChantInput', ChantInput)
  app.component('ChantOperation', ChantOperation)
  app.component('ChantPagination', ChantPagination)
  app.component('ChantPickerButton', ChantPickerButton)
  app.component('ChantProductPicker', ChantProductPicker)
  app.component('ChantRadio', ChantRadio)
  app.component('ChantSearchItem', ChantSearchItem)
  app.component('ChantSelect', ChantSelect)
  app.component('ChantSpeechPicker', ChantSpeechPicker)
  app.component('ChantTaskPicker', ChantTaskPicker)
  app.component('ChantSysTenant', ChantSysTenant)
  app.component('ChantTab', ChantTab)
  app.component('ChantTabs', ChantTabs)
  app.component('ChantTable', ChantTable)
  app.component('ChantTenantPicker', ChantTenantPicker)
  app.component('ChantTemplateDownload', ChantTemplateDownload)
  app.component('ChantTree', ChantTree)
  app.component('ChantUpload', ChantUpload)
  app.component('ChantUploadInline', ChantUploadInline)
  app.component('ChantUploadSingle', ChantUploadSingle)
  app.component('ChantUserPicker', ChantUserPicker)
}

export default components
