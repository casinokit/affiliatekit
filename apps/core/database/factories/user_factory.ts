import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'password123',
      companyName: faker.company.name(),
      status: faker.helpers.arrayElement(['pending', 'active', 'suspended']),
      streetAddress: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postal: faker.location.zipCode(),
      country: faker.location.country(),
      handler: faker.helpers.arrayElement(['telegram', 'email', 'whatsapp']),
      handlerUsername: faker.internet.username(),
    }
  })
  .build()
