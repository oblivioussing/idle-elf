export default [
  {
    path: '/order',
    component: () => import('@/components/home-layout/index.vue'),
    meta: { icon: 'setting', title: '订单管理' },
    children: [
      {
        path: 'order-list/index',
        component: () => import('@/views/order/order-list/index.vue'),
        meta: { title: '订单列表' }
      },
      {
        path: 'order-list/add',
        component: () => import('@/views/order/order-list/add.vue'),
        meta: { title: '订单列表新增' }
      },
      {
        path: 'order-list/edit',
        component: () => import('@/views/order/order-list/edit.vue'),
        meta: { title: '订单列表编辑' }
      }
    ]
  }
]
