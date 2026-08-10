import { ProgramSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from '@drago1204/adonis-lucid-soft-deletes'
import { ProgramStatus } from '#enums/program_status'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Brand from '#models/brand'

export default class Program extends compose(ProgramSchema, SoftDeletes) {
  declare status: ProgramStatus

  @manyToMany(() => Brand, {
    pivotTable: 'program_brand',
  })
  declare brands: ManyToMany<typeof Brand>
}

