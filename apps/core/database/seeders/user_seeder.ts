import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import User from '#models/user'
import { UserStatus } from '#enums/user_status'

export default class extends BaseSeeder {
  // Only run this seeder in development/test environments
  static environment = ['development', 'test']

  async run() {
    const adminRole = await Role.firstOrCreate({ slug: 'admin' }, { name: 'Admin' })
    const affiliateRole = await Role.firstOrCreate({ slug: 'affiliate' }, { name: 'Affiliate' })

    const [adminUser] = await User.updateOrCreateMany('email', [
      {
        email: 'admin@example.com',
        fullName: 'Admin User',
        password: 'password123',
        status: UserStatus.ACTIVE,
      },
    ])

    await adminUser.related('roles').sync([adminRole.id])

    const affiliates = await User.updateOrCreateMany(
      'email',
      Array.from({ length: 50 }, (_, index) => ({
        email: `affiliate${index + 1}@example.com`,
        fullName: `Affiliate User ${index + 1}`,
        companyName: `Affiliate Company ${index + 1}`,
        password: 'password123',
        status: UserStatus.ACTIVE,
        meta: {
          trafficSource: 'SEO',
          imHandlerType: 'Telegram',
          imHandlerUsername: `affiliate${index + 1}`,
        },
      }))
    )

    await Promise.all(
      affiliates.map((affiliate) => affiliate.related('roles').sync([affiliateRole.id]))
    )
  }
}
