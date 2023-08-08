import { createRouter, createWebHistory } from 'vue-router'

const HomeLayout = () => import('@/components/home-layout/index.vue')
const index = () => import('@/views/index/index.vue')
const login = () => import('@/views/app/login/index.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeLayout,
      children: [
        {
          path: '/',
          component: index,
          meta: { title: '首页' }
        }
      ]
    },
    {
      path: '/login',
      component: login
    }
  ]
})

export default router
