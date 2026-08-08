import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'commission_plan_assignments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table
        .uuid('program_id')
        .references('id')
        .inTable('programs')
        .onDelete('CASCADE')
        .notNullable()
      table.uuid('brand_id').nullable().references('id').inTable('brands').onDelete('CASCADE')
      table.uuid('affiliate_id').nullable().references('id').inTable('users').onDelete('CASCADE')
      table
        .uuid('commission_plan_id')
        .references('id')
        .inTable('commission_plans')
        .onDelete('CASCADE')
        .notNullable()

      table.string('status').notNullable().defaultTo('active')
      table.timestamp('starts_at').nullable()
      table.timestamp('ends_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
