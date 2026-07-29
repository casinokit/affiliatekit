import { BaseSeeder } from '@adonisjs/lucid/seeders'

import { UserFactory } from '#database/factories/user_factory'

export default class extends BaseSeeder {
  // Only run this seeder in development/testing environments
  static environment = ['development', 'testing']

  async run() {
    // Generate 50 fake affiliate users
    await UserFactory.createMany(250)
  }
}
