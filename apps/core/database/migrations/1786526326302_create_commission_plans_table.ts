import { BaseSchema } from '@adonisjs/lucid/schema'
import { CommissionType } from '#enums/commission_type'

export default class extends BaseSchema {
  protected tableName = 'commission_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery).first()

      table.string('name').notNullable()
      table.string('model').notNullable().defaultTo(CommissionType.REVSHARE)
      table.decimal('revshare_percentage', 5, 2).defaultTo(0.0)
      table.decimal('cpa_amount', 10, 2).defaultTo(0.0)
      table.decimal('cpa_trigger_deposit', 10, 2).defaultTo(0.0)
      table.decimal('cpa_trigger_wager', 10, 2).defaultTo(0.0)
      table.boolean('has_negative_carryover').defaultTo(false)
      table.boolean('is_tiered').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
