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
        router.get('profile', [controllers.shared.Profile, 'show']).as('profile.show')
        router.put('profile', [controllers.shared.Profile, 'update']).as('profile.update')
        router.put('password', [controllers.shared.Profile, 'updatePassword']).as('password.update')
        router.get('sessions', [controllers.shared.Profile, 'sessions']).as('sessions.index')
        router.delete('sessions/:id', [controllers.shared.Profile, 'destroySession']).as('sessions.destroy')
      })
      .prefix('account')
      .as('account')
      .use(middleware.auth())
  })
  .prefix('/api/v1')

import './routes/admin.js'
import './routes/affiliate.js'
