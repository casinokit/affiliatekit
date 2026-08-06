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
      {
        path: 'profile',
        name: 'affiliate.profile',
        component: () => import('@/views/shared/profile.vue'),
      }
    ],
  },
]

export default affiliateRoutes
