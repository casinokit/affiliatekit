import { BrandSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from '@drago1204/adonis-lucid-soft-deletes'

export default class Brand extends compose(BrandSchema, SoftDeletes) {
  // Add any custom getters, setters, or relations here
}