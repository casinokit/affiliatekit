import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './auth'
import errorRoutes from './errors'
import adminRoutes from './admin'
import affiliateRoutes from './affiliate'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'auth.login' },
    },
    ...authRoutes,
    ...adminRoutes,
    ...affiliateRoutes,
    ...errorRoutes,
  ],
})

export default router
