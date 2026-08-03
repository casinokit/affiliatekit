import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckRoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: string[]) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ message: 'Unauthorized' })
    }

    await user.load('roles')

    const userRoles = user.roles.map((role) => role.slug)

    // Check if user has ANY of the allowed roles
    const hasRole = allowedRoles.some((role) => userRoles.includes(role))

    if (!hasRole) {
      return ctx.response.forbidden({ message: 'Forbidden. Insufficient role permissions.' })
    }

    return await next()
  }
}