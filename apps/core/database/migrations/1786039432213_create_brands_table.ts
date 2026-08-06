import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'brands'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('logo').nullable()
      table.string('url').nullable()
      table.string('status').notNullable().defaultTo('active') // active, inactive
      table.string('security_code').notNullable().unique()
      table.jsonb('ip_whitelist').nullable()

      table.timestamp('created_at').nullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
