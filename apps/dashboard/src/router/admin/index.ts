import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'admin.dashboard',
    component: () => import('../../views/admin/dashboard/index.vue'),
  },
]

export default adminRoutes
