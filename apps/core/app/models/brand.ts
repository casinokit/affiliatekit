import { BrandSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from '@drago1204/adonis-lucid-soft-deletes'
import { BrandStatus } from '#enums/brand_status'

export default class Brand extends compose(BrandSchema, SoftDeletes) {
  declare status: BrandStatus
}