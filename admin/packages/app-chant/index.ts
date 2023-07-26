import { App } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { createPinia } from 'pinia'
// @ts-ignore
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/themes/default.css'
import interceptor from './api/interceptor'
import components from './components/index'
import factory from './router/factory'
import { vuei18n } from './plugs'
import router from './router'
import { base, bus, core, utils } from './share'
import { Bus } from './enum'
import { useAppStore, useUserStore } from './store'
// element-plus主题
import './style/element-var.scss'

type Modules = Record<string, () => Promise<{ [key: string]: any }>>
type Options = {
  modules: Modules
  routes?: RouteRecordRaw[]
}

async function install(app: App<Element>, options: Options) {
  // 拦截器
  interceptor()
  // use
  app.use(contentmenu)
  app.use(createPinia())
  app.use(vuei18n)
  // 路由动态加载
  options?.routes?.forEach((item) => {
    router.addRoute(item)
  })
  // 保存路由模块
  const appStore = useAppStore()
  appStore.pageModules = options.modules

  app.use(router)
  // 全局组件初始化
  components(app)
}

export default { install }

export * from './export'
