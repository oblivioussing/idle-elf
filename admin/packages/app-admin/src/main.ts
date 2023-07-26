import { createApp } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import chant, { bus, Bus } from 'chant'
import App from './App.vue'
import '../components.d'

export type Modules = Record<string, () => Promise<{ [key: string]: any }>>
export const modules = import.meta.glob('./views/**/*.vue') as Modules
type Config = {
  modules: Modules
  routes?: RouteRecordRaw[]
}

const app = createApp(App)

function main(config: Config) {
  // 因为chant中有异步请求,所以需要通过事件来通知渲染
  bus.on(Bus.Mount, () => {
    app.mount('#app')
  })
  app.use(chant, config)
}

export default main
