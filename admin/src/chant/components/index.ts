import { defineAsyncComponent, type App } from 'vue'
import './components.d'

const ChantButton = defineAsyncComponent(() => import('./ChantButton.vue'))
const ChantDialog = defineAsyncComponent(() => import('./ChantDialog.vue'))
const ChantForm = defineAsyncComponent(() => import('./ChantForm.vue'))
const ChantFormFooter = defineAsyncComponent(
  () => import('./ChantFormFooter.vue')
)
const ChantIconButton = defineAsyncComponent(
  () => import('./ChantIconButton.vue')
)
const ChantTableOperation = defineAsyncComponent(
  () => import('./chant-table-operation/Index.vue')
)
const ChantPagination = defineAsyncComponent(
  () => import('./ChantPagination.vue')
)
const ChantPicker = defineAsyncComponent(() => import('./ChantPicker.vue'))
const ChantTable = defineAsyncComponent(() => import('./ChantTable.vue'))
const ChantTableSearch = defineAsyncComponent(
  () => import('./ChantTableSearch.vue')
)
const ChantUpload = defineAsyncComponent(() => import('./ChantUpload.vue'))

function components(app: App<Element>) {
  app.component('ChantButton', ChantButton)
  app.component('ChantDialog', ChantDialog)
  app.component('ChantForm', ChantForm)
  app.component('ChantFormFooter', ChantFormFooter)
  app.component('ChantIconButton', ChantIconButton)
  app.component('ChantPagination', ChantPagination)
  app.component('ChantPicker', ChantPicker)
  app.component('ChantTable', ChantTable)
  app.component('ChantTableOperation', ChantTableOperation)
  app.component('ChantTableSearch', ChantTableSearch)
  app.component('ChantUpload', ChantUpload)
}

export default components
