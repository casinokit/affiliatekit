import { createRouter, createWebHistory } from 'vue-router'
import authRoutes from './auth'
import errorRoutes from './errors'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'auth.login' },
    },
    ...authRoutes,
    ...errorRoutes,
  ],
})

export default router
