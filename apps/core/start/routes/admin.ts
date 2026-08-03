import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/dashboard', () => {
      return { message: 'Welcome to the Admin Portal' }
    })
  })
  .prefix('/api/v1/admin')
  .use(middleware.auth())
  .use(middleware.checkRole(['admin']))
