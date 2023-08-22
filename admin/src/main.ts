import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import components from './components/index'
import router from './router'

const app = createApp(App)
// use
app.use(createPinia())
app.use(router)
// 全局组件
components(app)

app.mount('#app')
