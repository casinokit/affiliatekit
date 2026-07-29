import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permission_role'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('permission_id').references('id').inTable('permissions').onDelete('CASCADE')
      table.uuid('role_id').references('id').inTable('roles').onDelete('CASCADE')
      table.primary(['permission_id', 'role_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}