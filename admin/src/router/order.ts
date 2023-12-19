export default [
  {
    path: '/order',
    component: () => import('@/components/home-layout/index.vue'),
    meta: { icon: 'setting', titleEn: 'order manager', titleZh: '订单管理' },
    children: [
      {
        path: 'order-list/index',
        component: () => import('@/views/order/order-list/index.vue'),
        meta: { titleEn: 'order list', titleZh: '订单列表' }
      },
      {
        path: 'order-list/add',
        component: () => import('@/views/order/order-list/add.vue'),
        meta: { titleEn: 'order add', titleZh: '订单新增' }
      },
      {
        path: 'order-list/edit',
        component: () => import('@/views/order/order-list/edit.vue'),
        meta: { titleEn: 'order edit', titleZh: '订单编辑' }
      }
    ]
  }
]
