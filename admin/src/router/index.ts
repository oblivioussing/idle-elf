import { createRouter, createWebHistory } from 'vue-router'

import app from './app' // app
import custom from './custom' // 客户管理
import order from './order' // 订单管理

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...app, ...custom, ...order]
})

export default router
