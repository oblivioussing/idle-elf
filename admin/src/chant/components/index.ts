import { defineAsyncComponent, type App } from 'vue'
import './components.d'

const ChantButton = defineAsyncComponent(() => import('./ChantButton.vue'))
const ChantColumnOperate = defineAsyncComponent(
  () => import('./ChantColumnOperate.vue')
)
const ChantDialog = defineAsyncComponent(() => import('./ChantDialog.vue'))
const ChantForm = defineAsyncComponent(() => import('./ChantForm.vue'))
const ChantFormFooter = defineAsyncComponent(
  () => import('./ChantFormFooter.vue')
)
const ChantIconButton = defineAsyncComponent(
  () => import('./ChantIconButton.vue')
)
const ChantMoreDropdown = defineAsyncComponent(
  () => import('./ChantMoreDropdown.vue')
)
const ChantPagination = defineAsyncComponent(
  () => import('./ChantPagination.vue')
)
const ChantPickerButton = defineAsyncComponent(
  () => import('./ChantPickerButton.vue')
)
const ChantSelectedTable = defineAsyncComponent(
  () => import('./ChantSelectedTable.vue')
)
const ChantTable = defineAsyncComponent(() => import('./ChantTable.vue'))
const ChantTableOperate = defineAsyncComponent(
  () => import('./chant-table-operate/Index.vue')
)
const ChantTablePicker = defineAsyncComponent(
  () => import('./ChantTablePicker.vue')
)
const ChantTableSearch = defineAsyncComponent(
  () => import('./ChantTableSearch.vue')
)
const ChantUpload = defineAsyncComponent(() => import('./ChantUpload.vue'))

function components(app: App<Element>) {
  app.component('ChantButton', ChantButton)
  app.component('ChantColumnOperate', ChantColumnOperate)
  app.component('ChantDialog', ChantDialog)
  app.component('ChantForm', ChantForm)
  app.component('ChantFormFooter', ChantFormFooter)
  app.component('ChantIconButton', ChantIconButton)
  app.component('ChantMoreDropdown', ChantMoreDropdown)
  app.component('ChantPagination', ChantPagination)
  app.component('ChantPickerButton', ChantPickerButton)
  app.component('ChantSelectedTable', ChantSelectedTable)
  app.component('ChantTablePicker', ChantTablePicker)
  app.component('ChantTable', ChantTable)
  app.component('ChantTableOperate', ChantTableOperate)
  app.component('ChantTableSearch', ChantTableSearch)
  app.component('ChantUpload', ChantUpload)
}

export default components
