import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { UserStatus } from '#enums/user_status'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
      companyName: faker.company.name(),
      status: UserStatus.ACTIVE,
      meta: {
        trafficSource: faker.helpers.arrayElement(['SEO', 'Social Media', 'Paid Ads', 'Email', 'Other']),
        imHandlerType: faker.helpers.arrayElement(['Telegram', 'WhatsApp', 'Discord', 'Signal']),
        imHandlerUsername: faker.internet.username(),
      },
    }
  })
  .build()
