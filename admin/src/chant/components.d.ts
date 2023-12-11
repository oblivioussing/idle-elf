import ChantIconButton from './ChantIconButton.vue'
import ChantOperation from './chant-operation/index.vue'
import ChantPagination from './ChantPagination.vue'
import ChantTable from './ChantTable.vue'
import IconFont from './IconFont.vue'

import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ChantIconButton: typeof ChantIconButton
    ChantOperation: typeof ChantOperation
    ChantPagination: typeof ChantPagination
    ChantTable: typeof ChantTable
    IconFont: typeof IconFont
  }
}
