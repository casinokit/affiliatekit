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

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('register', [controllers.auth.Register, 'store'])
        router.post('login', [controllers.auth.Login, 'store'])
        router.post('forgot-password', [controllers.auth.PasswordReset, 'forgot'])
        router.post('reset-password', [controllers.auth.PasswordReset, 'reset'])
        router.post('verify-email', [controllers.auth.EmailVerifications, 'verify'])
        router.post('logout', [controllers.auth.Login, 'destroy']).use(middleware.auth())
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
