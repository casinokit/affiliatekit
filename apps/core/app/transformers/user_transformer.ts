import type User from '#models/user'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const base = this.pick(this.resource, [
      'id',
      'fullName',
      'email',
      'status',
    ])
    
    // Extract strings if relationships are loaded
    const roles = this.resource.roles?.map((role) => role.slug) || []
    const permissions = new Set<string>()
    this.resource.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        if (permission.slug) permissions.add(permission.slug)
      })
    })

    return {
      ...base,
      roles,
      permissions: Array.from(permissions),
    }
  }
}
