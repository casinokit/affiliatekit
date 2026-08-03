import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router.get('/dashboard', () => {
      return { message: 'Welcome to the Affiliate Portal' }
    })
  })
  .prefix('/api/v1/affiliate')
  .use(middleware.auth())
  .use(middleware.checkRole(['affiliate']))
