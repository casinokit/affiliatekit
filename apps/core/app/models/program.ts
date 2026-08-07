import { ProgramSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from '@drago1204/adonis-lucid-soft-deletes'
import { ProgramStatus } from '#enums/program_status'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Brand from '#models/brand'

export default class Program extends compose(ProgramSchema, SoftDeletes) {
  declare status: ProgramStatus

  @hasMany(() => Brand)
  declare brands: HasMany<typeof Brand>
}
