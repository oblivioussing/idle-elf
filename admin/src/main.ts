import { createApp } from 'vue'
import { createPinia } from 'pinia'
// @ts-ignore
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/themes/default.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
// use
app.use(contentmenu)
app.use(createPinia())
app.use(router)

app.mount('#app')
