import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.get('/dashboard', () => {
      return { message: 'Welcome to the Admin Portal' }
    })
    
    // Settings Routes
    router.get('/settings/:group', [controllers.admin.Settings, 'getSettingsByGroup'])
    router.put('/settings/group/:group', [controllers.admin.Settings, 'updateSettingsByGroup'])
    router.put('/settings/key/:key', [controllers.admin.Settings, 'updateSettingByKey'])
  })
  .prefix('/api/v1/admin')
  .use(middleware.auth())
  .use(middleware.checkRole(['admin']))
