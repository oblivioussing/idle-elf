import ChantTable from './ChantTable.vue'
import ChantOperation from './chant-operation/index.vue'
import ChantPagination from './ChantPagination.vue'
import IconFont from './IconFont.vue'

import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ChantOperation: typeof ChantOperation
    ChantPagination: typeof ChantPagination
    ChantTable: typeof ChantTable
    IconFont: typeof IconFont
  }
}
