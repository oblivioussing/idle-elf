export default [
  {
    path: '/user',
    component: () => import('@/components/home-layout/index.vue'),
    meta: { icon: 'nickname', titleEn: 'user manager', titleZh: '用户管理' },
    children: [
      {
        path: 'user-list/index',
        component: () => import('@/views/user/user-list/index.vue'),
        meta: { titleEn: 'user list', titleZh: '用户列表' }
      },
      {
        path: 'user-list/add',
        component: () => import('@/views/user/user-list/add.vue'),
        meta: { titleEn: 'user add', titleZh: '用户新增' }
      },
      {
        path: 'user-list/edit',
        component: () => import('@/views/user/user-list/edit.vue'),
        meta: { titleEn: 'user edit', titleZh: '用户编辑' }
      }
    ]
  }
]
