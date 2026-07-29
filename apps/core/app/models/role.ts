import { RoleSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Permission from '#models/permission'

export default class Role extends RoleSchema {
  @manyToMany(() => User)
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Permission)
  declare permissions: ManyToMany<typeof Permission>
}