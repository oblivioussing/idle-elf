import ChantButton from './ChantButton.vue'
import ChantDialog from './ChantDialog.vue'
import ChantForm from './ChantForm.vue'
import ChantFormFooter from './ChantFormFooter.vue'
import ChantIconButton from './ChantIconButton.vue'
import ChantPagination from './ChantPagination.vue'
import ChantPickerButton from './ChantPickerButton.vue'
import ChantTable from './ChantTable.vue'
import ChantTableOperation from './chant-table-operation/Index.vue'
import ChantTablePicker from './ChantTablePicker.vue'
import ChantTableSearch from './ChantTableSearch.vue'
import ChantUpload from './ChantUpload.vue'

import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ChantButton: typeof ChantButton
    ChantDialog: typeof ChantDialog
    ChantForm: typeof ChantForm
    ChantFormFooter: typeof ChantFormFooter
    ChantIconButton: typeof ChantIconButton
    ChantPagination: typeof ChantPagination
    ChantPickerButton: typeof ChantPickerButton
    ChantTable: typeof ChantTable
    ChantTableOperation: typeof ChantTableOperation
    ChantTablePicker: typeof ChantTablePicker
    ChantTableSearch: typeof ChantTableSearch
    ChantUpload: typeof ChantUpload
  }
}
