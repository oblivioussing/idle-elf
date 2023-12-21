import ChantForm from './ChantForm.vue'
import ChantButton from './ChantButton.vue'
import ChantIconButton from './ChantIconButton.vue'
import ChantInput from './ChantInput.vue'
import ChantOperation from './chant-operation/index.vue'
import ChantPagination from './ChantPagination.vue'
import ChantTable from './ChantTable.vue'
import IconFont from './IconFont.vue'

import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ChantForm: typeof ChantForm
    ChantButton: typeof ChantButton
    ChantIconButton: typeof ChantIconButton
    ChantInput: typeof ChantInput
    ChantOperation: typeof ChantOperation
    ChantPagination: typeof ChantPagination
    ChantTable: typeof ChantTable
    IconFont: typeof IconFont
  }
}
