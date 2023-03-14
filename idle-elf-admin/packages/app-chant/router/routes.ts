const notFound = () => import('../../app-admin/src/views/app/404/index.vue') // 404
const login = () => import('../../app-admin/src/views/app/login/index.vue') // 登陆
const auth = () => import('../../app-admin/src/views/app/auth/index.vue') // 授权

export default [
  {
    path: '/:pathMatch(.*)*',
    component: notFound
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/auth',
    component: auth
  }
]
