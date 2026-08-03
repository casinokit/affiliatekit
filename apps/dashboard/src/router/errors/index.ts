import type { RouteRecordRaw } from 'vue-router'

const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/not-found',
    name: 'errors.not-found',
    component: () => import('../../views/errors/not-found.vue'),
  },
  {
    path: '/forbidden',
    name: 'errors.forbidden',
    component: () => import('../../views/errors/forbidden.vue'),
  },
  {
    path: '/server-error',
    name: 'errors.server-error',
    component: () => import('../../views/errors/server-error.vue'),
  },
  {
    path: '/network-error',
    name: 'errors.network',
    component: () => import('../../views/errors/network.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'errors.not-found' },
  },
]

export default errorRoutes
