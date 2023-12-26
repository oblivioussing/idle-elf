import ChantButton from './ChantButton.vue'
import ChantForm from './ChantForm.vue'
import ChantFormFooter from './ChantFormFooter.vue'
import ChantIconButton from './ChantIconButton.vue'
import ChantPagination from './ChantPagination.vue'
import ChantTable from './ChantTable.vue'
import ChantTableOperation from './chant-table-operation/index.vue'
import ChantTableSearch from './ChantTableSearch.vue'
import IconFont from './IconFont.vue'

import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ChantButton: typeof ChantButton
    ChantForm: typeof ChantForm
    ChantFormFooter: typeof ChantFormFooter
    ChantIconButton: typeof ChantIconButton
    ChantPagination: typeof ChantPagination
    ChantTable: typeof ChantTable
    ChantTableOperation: typeof ChantTableOperation
    ChantTableSearch: typeof ChantTableSearch
    IconFont: typeof IconFont
  }
}
