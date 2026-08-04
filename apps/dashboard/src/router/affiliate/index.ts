import type { RouteRecordRaw } from 'vue-router'

const affiliateRoutes: RouteRecordRaw[] = [
  {
    path: '/affiliate',
    redirect: {name: 'affiliate.dashboard'},
    component: () => import('@/layouts/affiliate/index.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'affiliate.dashboard',
        component: () => import('@/views/affiliate/dashboard/index.vue'),
      },
    ],
  },
]

export default affiliateRoutes
