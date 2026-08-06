import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { UserStatus } from '#enums/user_status'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password',
      companyName: faker.company.name(),
      status: UserStatus.ACTIVE,
      streetAddress: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postal: faker.location.zipCode(),
      country: faker.location.country(),
      handler: faker.helpers.arrayElement(['email', 'skype', 'whatsapp']),
      handlerUsername: faker.internet.username(),
    }
  })
  .build()
