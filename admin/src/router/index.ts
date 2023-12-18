import { createRouter, createWebHistory } from 'vue-router'

import app from './app' // app
import order from './order' // 订单管理
import user from './user' // 用户管理

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...app, ...order, ...user]
})

export default router
