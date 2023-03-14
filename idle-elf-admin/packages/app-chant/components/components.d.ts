import ChantAssign from './chant-assign/index.vue'
import ChantAudioPlayer from './ChantAudioPlayer.vue'
import ChantAssignType from './chant-assign/AssignType.vue'
import ChantBasePicker from './ChantBasePicker.vue'
import ChantButtonGroup from './ChantButtonGroup.vue'
import ChantCall from './ChantCall.vue'
import ChantCasePicker from './chant-case-picker/index.vue'
import ChantCharts from './ChantCharts.vue'
import ChantChat from './chant-chat/index.vue'
import ChantCustomerPicker from './chant-customer-picker/index.vue'
import ChantDepartmentPicker from './chant-department-picker/index.vue'
import ChantDialog from './ChantDialog.vue'
import ChantForm from './ChantForm.vue'
import ChantFormItem from './ChantFormItem.vue'
import ChantIconButton from './ChantIconButton.vue'
import ChantIconPicker from './ChantIconPicker.vue'
import ChantInput from './ChantInput.vue'
import ChantOperation from './chant-operation/index.vue'
import ChantPagination from './ChantPagination.vue'
import ChantPickerButton from './ChantPickerButton.vue'
import ChantProductPicker from './chant-product-picker/index.vue'
import ChantSearchItem from './ChantSearchItem.vue'
import ChantSelect from './ChantSelect.vue'
import ChantRadio from './ChantRadio.vue'
import ChantSpeechPicker from './chant-speech-picker/index.vue'
import ChantTaskPicker from './chant-task-picker/index.vue'
import ChantSysTenant from './ChantSysTenant.vue'
import ChantTab from './chant-tab/Tab.vue'
import ChantTabs from './chant-tab/Tabs.vue'
import ChantTable from './ChantTable.vue'
import ChantTenantPicker from './chant-tenant-picker/index.vue'
import ChantTemplateDownload from './ChantTemplateDownload.vue'
import ChantTree from './chant-tree/index.vue'
import ChantUpload from './chant-upload/index.vue'
import ChantUploadInline from './chant-upload/inline.vue'
import ChantUploadSingle from './chant-upload/single.vue'
import ChantUserPicker from './chant-user-picker/index.vue'

import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ChantAudioPlayer: typeof ChantAudioPlayer
    ChantAssign: typeof ChantAssign
    ChantAssignType: typeof ChantAssignType
    ChantBasePicker: typeof ChantBasePicker
    ChantButtonGroup: typeof ChantButtonGroup
    ChantCall: typeof ChantCall
    ChantCasePicker: typeof ChantCasePicker
    ChantCharts: typeof ChantCharts
    ChantChat: typeof ChantChat
    ChantCustomerPicker: typeof ChantCustomerPicker
    ChantDepartmentPicker: typeof ChantDepartmentPicker
    ChantDialog: typeof ChantDialog
    ChantForm: typeof ChantForm
    ChantFormItem: typeof ChantFormItem
    ChantIconButton: typeof ChantIconButton
    ChantIconPicker: typeof ChantIconPicker
    ChantInput: typeof ChantInput
    ChantOperation: typeof ChantOperation
    ChantPagination: typeof ChantPagination
    ChantPickerButton: typeof ChantPickerButton
    ChantProductPicker: typeof ChantProductPicker
    ChantSearchItem: typeof ChantSearchItem
    ChantSelect: typeof ChantSelect
    ChantRadio: typeof ChantRadio
    ChantSpeechPicker: typeof ChantSpeechPicker
    ChantTaskPicker: typeof ChantTaskPicker
    ChantSysTenant: typeof ChantSysTenant
    ChantTab: typeof ChantTab
    ChantTabs: typeof ChantTabs
    ChantTable: typeof ChantTable
    ChantTenantPicker: typeof ChantTenantPicker
    ChantTemplateDownload: typeof ChantTemplateDownload
    ChantTree: typeof ChantTree
    ChantUpload: typeof ChantUpload
    ChantUploadInline: typeof ChantUploadInline
    ChantUploadSingle: typeof ChantUploadSingle
    ChantUserPicker: typeof ChantUserPicker
  }
}
