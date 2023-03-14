import router from './index'
import { useAppStore, useUserStore } from '../store'
import { modules as adminModules } from '../../app-admin/src/main'

const development = () => import('@admin/app/development.vue')
const index = () => import('@admin/app/index.vue')
const home = () => import('../components/home-layout/index.vue')

function factory() {
  const appStore = useAppStore()
  const modules = Object.assign(adminModules, appStore.pageModules)
  const pathKeys = Object.keys(modules)
  // store
  const userStore = useUserStore()
  // 添加首页
  addIndex()
  // routes
  const routes = userStore.menuList
  if (!routes.length) {
    return
  }
  routes?.forEach((item: any) => {
    item?.children?.forEach((child: any) => {
      const { meta, path } = child
      if (path) {
        const moduleKey = pathKeys.find(
          (item) => item.indexOf(path + '/index.vue') >= 0
        ) as string
        const component = modules && (modules[moduleKey] as any)
        router.addRoute('/', {
          path,
          component: component || development,
          meta
        })
      }
    })
  })

  // 添加首页
  function addIndex() {
    const map = {
      11: './views/index/intelligence-call', // 智能外呼
      12: './views/index/manual-call', // 人工外呼
      13: './views/index/auto-add-wx', // 自动加微
      14: './views/index/marketing' // 营销
    }
    const path = map[userStore.indexCode]
    const row = {
      path: '/',
      name: '/',
      component: home,
      children: [
        {
          path: '/',
          component: modules![`${path}/index.vue`] || index,
          meta: { titleEn: 'index', titleZh: '首页' }
        }
      ]
    }
    router.addRoute(row as any)
  }
}

export default factory
