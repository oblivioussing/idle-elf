export default [
  {
    path: '/user',
    component: () => import('@/components/home-layout/index.vue'),
    meta: { icon: 'nickname', title: '用户管理' },
    children: [
      {
        path: 'user-list/index',
        component: () => import('@/views/user/user-list/index.vue'),
        meta: { title: '用户列表' }
      },
      {
        path: 'user-list/add',
        component: () => import('@/views/user/user-list/add.vue'),
        meta: { title: '用户新增' }
      },
      {
        path: 'user-list/edit',
        component: () => import('@/views/user/user-list/edit.vue'),
        meta: { title: '用户编辑' }
      }
    ]
  }
]
