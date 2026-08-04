import type { RouteRecordRaw } from 'vue-router'

const affiliateRoutes: RouteRecordRaw[] = [
  {
    path: '/affiliate',
    name: 'affiliate.dashboard',
    component: () => import('@/views/affiliate/dashboard/index.vue'),
  },
]

export default affiliateRoutes
