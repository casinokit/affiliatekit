import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    redirect: { name: 'admin.dashboard' },
    component: () => import('@/layouts/admin/index.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'admin.dashboard',
        component: () => import('@/views/admin/dashboard/index.vue'),
      },
      {
        path: 'settings',
        redirect: { name: 'admin.settings.general' },
        component: () => import('@/views/admin/settings/index.vue'),
        children: [
          {
            path: 'general',
            name: 'admin.settings.general',
            component: () => import('@/views/admin/settings/general.vue'),
          },
          {
            path: 'registration',
            name: 'admin.settings.registration',
            component: () => import('@/views/admin/settings/registration.vue'),
          },
        ],
      },
    ],
  },
]

export default adminRoutes
