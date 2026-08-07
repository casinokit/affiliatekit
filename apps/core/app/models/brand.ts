import { BrandSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from '@drago1204/adonis-lucid-soft-deletes'
import { BrandStatus } from '#enums/brand_status'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Program from '#models/program'

export default class Brand extends compose(BrandSchema, SoftDeletes) {
  declare status: BrandStatus

  @belongsTo(() => Program)
  declare program: BelongsTo<typeof Program>
}