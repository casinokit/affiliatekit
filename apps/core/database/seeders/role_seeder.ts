import { BaseSeeder } from '@adonisjs/lucid/seeders'

import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    await Role.updateOrCreateMany('slug', [
      { name: 'Admin', slug: 'admin' },
      { name: 'Affiliate Manager', slug: 'affiliate_manager' },
      { name: 'Affiliate', slug: 'affiliate' },
    ])
  }
}