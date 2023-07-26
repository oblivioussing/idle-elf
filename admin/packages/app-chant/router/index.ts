import { createRouter, createWebHistory } from 'vue-router'
import qs from 'qs'
import { StorageEnum } from '../enum'
import { base, storage } from '../share'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [...routes]
})

// 全局解析守卫
router.beforeResolve((to) => {
  // 跳转的页面参数
  const queryMap = storage.getSession(StorageEnum.RouterQuery) || ({} as any)
  const { path, query } = to
  const queryStore = queryMap[path]
  if (base.isEmpty(query) && !base.isEmpty(queryStore)) {
    const queryString = qs.stringify(queryStore)
    setTimeout(() => {
      history.replaceState(history.state, '', `${path}?${queryString}`)
    }, 0)
    to.query = queryStore
  } else {
    if (!base.isEmpty(query)) {
      queryMap[path] = query
      storage.setSession(StorageEnum.RouterQuery, queryMap)
    }
  }
})

export default router
