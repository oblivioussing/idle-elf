import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import chant from './chant'
import { vuei18n } from './plugs'
import router from './router'
// element css
import 'element-plus/theme-chalk/el-message.css'

const app = createApp(App)
// use
app.use(chant)
app.use(createPinia())
app.use(router)
app.use(vuei18n)

app.mount('#app')
