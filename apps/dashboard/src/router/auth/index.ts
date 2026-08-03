const authRoutes = [
  {
    path: '/auth',
    component: () => import('../../layouts/auth/index.vue'),
    redirect: { name: 'auth.login' },
    children: [
      {
        path: 'register',
        name: 'auth.register',
        component: () => import('../../views/auth/register/index.vue'),
      },
      {
        path: 'login',
        name: 'auth.login',
        component: () => import('../../views/auth/login/index.vue'),
      },
      {
        path: 'forgot-password',
        name: 'auth.forgot-password',
        component: () => import('../../views/auth/forgot-password/index.vue'),
      },
      {
        path: 'reset-password',
        name: 'auth.reset-password',
        component: () => import('../../views/auth/reset-password/index.vue'),
      },
    ],
  },
]

export default authRoutes
