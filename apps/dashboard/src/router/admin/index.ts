import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    redirect: { name: 'admin.dashboard' },
    component: () => import("@/layouts/admin/index.vue"),
    children: [
      {
        path: 'dashboard',
        name: 'admin.dashboard',
        component: () => import('@/views/admin/dashboard/index.vue'),
      },
    ],
  },
]

export default adminRoutes
