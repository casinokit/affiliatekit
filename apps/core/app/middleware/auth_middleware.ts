import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards)

    const user = ctx.auth.user
    if (user && !user.canLogin) {
      const { Exception } = await import('@adonisjs/core/exceptions')
      throw new Exception(`Your account is ${user.status}. Please contact support.`, { status: 403 })
    }

    return next()
  }
}
