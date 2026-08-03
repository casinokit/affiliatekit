/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { authThrottle } from '#start/limiter'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('register', [controllers.auth.Register, 'store']).use(authThrottle)
        router.post('login', [controllers.auth.Login, 'store']).use(authThrottle)
        router.post('forgot-password', [controllers.auth.PasswordReset, 'forgot']).use(authThrottle)
        router.post('reset-password', [controllers.auth.PasswordReset, 'reset']).use(authThrottle)
        router.post('verify-email', [controllers.auth.EmailVerifications, 'verify']).use(authThrottle)
        router.post('logout', [controllers.auth.Login, 'destroy']).use(middleware.auth())
        router.post('logout-all', [controllers.auth.Login, 'destroyAll']).use(middleware.auth())
        router.get('me', [controllers.auth.Login, 'me']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')

import './routes/admin.js'
import './routes/affiliate.js'
