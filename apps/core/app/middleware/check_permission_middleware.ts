import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CheckPermissionMiddleware {
  async handle(ctx: HttpContext, next: NextFn, requiredPermissions: string[]) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ message: 'Unauthorized' })
    }

    await user.load('roles', (roleQuery) => {
      roleQuery.preload('permissions')
    })

    const userPermissions = new Set<string>()
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        if (permission.slug) {
          userPermissions.add(permission.slug)
        }
      })
    })

    // Check if the user has ALL required permissions to access this route
    const hasPermission = requiredPermissions.every((perm) => userPermissions.has(perm))

    if (!hasPermission) {
      return ctx.response.forbidden({ message: 'Forbidden. Insufficient action permissions.' })
    }

    return await next()
  }
}