import { BaseSchema } from '@adonisjs/lucid/schema'
import { BrandStatus } from '#enums/brand_status'

export default class extends BaseSchema {
  protected tableName = 'brands'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table.string('name').notNullable()
      table.string('logo').nullable()
      table.string('url').nullable()
      table.string('status').notNullable().defaultTo(BrandStatus.ACTIVE)
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
