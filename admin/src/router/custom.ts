export default [
  {
    path: '/custom',
    component: () => import('@/chant/home-layout/index.vue'),
    meta: { icon: 'nickname', title: '客户管理' },
    children: [
      {
        path: 'custom-list/index',
        component: () => import('@/views/custom/custom-list/index.vue'),
        meta: { title: '客户列表' }
      },
      {
        path: 'custom-list/add',
        component: () => import('@/views/custom/custom-list/add.vue'),
        meta: { title: '客户列表新增' }
      },
      {
        path: 'custom-list/edit',
        component: () => import('@/views/custom/custom-list/edit.vue'),
        meta: { title: '客户列表编辑' }
      }
    ]
  }
]
