import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'program_brand'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)

      table
        .uuid('program_id')
        .references('id')
        .inTable('programs')
        .onDelete('CASCADE')
        .notNullable()

      table
        .uuid('brand_id')
        .references('id')
        .inTable('brands')
        .onDelete('CASCADE')
        .notNullable()

      table.unique(['program_id', 'brand_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
