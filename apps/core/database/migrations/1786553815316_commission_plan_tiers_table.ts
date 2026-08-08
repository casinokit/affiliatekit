import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'commission_plan_tiers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery).first()

      table
        .uuid('commission_plan_id')
        .references('id')
        .inTable('commission_plans')
        .onDelete('CASCADE')
        .notNullable()
      table.decimal('min_value', 14, 2).notNullable().defaultTo(0.0)
      table.decimal('max_value', 14, 2).notNullable().defaultTo(0.0)
      table.decimal('revshare_percentage', 15, 2).notNullable().defaultTo(0.0)
      table.decimal('cpa_amount', 10, 2).notNullable().defaultTo(0.0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
