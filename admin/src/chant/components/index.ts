import { defineAsyncComponent, type App } from 'vue'
import './components.d'

const ChantButton = defineAsyncComponent(() => import('./ChantButton.vue'))
const ChantForm = defineAsyncComponent(() => import('./ChantForm.vue'))
const ChantFormFooter = defineAsyncComponent(
  () => import('./ChantFormFooter.vue')
)
const ChantIconButton = defineAsyncComponent(
  () => import('./ChantIconButton.vue')
)
const ChantTableOperation = defineAsyncComponent(
  () => import('./chant-table-operation/index.vue')
)
const ChantPagination = defineAsyncComponent(
  () => import('./ChantPagination.vue')
)
const ChantTable = defineAsyncComponent(() => import('./ChantTable.vue'))
const ChantTableSearch = defineAsyncComponent(
  () => import('./ChantTableSearch.vue')
)
const IconFont = defineAsyncComponent(() => import('./IconFont.vue'))

function components(app: App<Element>) {
  app.component('ChantButton', ChantButton)
  app.component('ChantForm', ChantForm)
  app.component('ChantFormFooter', ChantFormFooter)
  app.component('ChantIconButton', ChantIconButton)
  app.component('ChantPagination', ChantPagination)
  app.component('ChantTable', ChantTable)
  app.component('ChantTableOperation', ChantTableOperation)
  app.component('ChantTableSearch', ChantTableSearch)
  app.component('IconFont', IconFont)
}

export default components
