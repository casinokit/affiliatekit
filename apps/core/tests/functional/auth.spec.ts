import { test } from '@japa/runner'
import User from '#models/user'
import { UserStatus } from '#enums/user_status'
import Role from '#models/role'
import PasswordResetToken from '#models/password_reset_token'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import RegistrationEmail from '#mails/auth/registration_email'
import VerifyEmail from '#mails/auth/verify_email'

test.group('Auth flow', (group) => {
  group.each.setup(async () => {
    // Ensure Affiliate role exists
    await Role.firstOrCreate({ slug: 'affiliate' }, { name: 'Affiliate' })
  })

  group.each.teardown(async () => {
    await PasswordResetToken.query().delete()
    await User.query().delete()
  })

  test('register user', async ({ client, assert }) => {
    const { mails } = mail.fake()

    const response = await client.post('/api/v1/auth/register').json({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
    })

    response.assertStatus(201)
    response.assertBodyContains({
      success: true,
      message: 'Registration successful. Please wait until your account is activated.',
    })

    const user = await User.findBy('email', 'test@example.com')
    assert.isNotNull(user)
    assert.equal(user!.status, UserStatus.PENDING)
    assert.isNotNull(user!.emailVerificationToken)

    // Verify side-effects (Events -> Listeners -> Mails)
    mails.assertQueued(RegistrationEmail)
    mails.assertQueued(VerifyEmail)
    
    mail.restore()
  })

  test('verify email', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test2@example.com',
      password: 'password123',
      emailVerificationToken: 'secret-token',
      status: UserStatus.PENDING,
    })

    const response = await client.post('/api/v1/auth/verify-email').json({
      token: 'secret-token',
    })

    response.assertStatus(200)

    await user.refresh()
    assert.equal(user.status, UserStatus.ACTIVE)
    assert.isNull(user.emailVerificationToken)
    assert.isNotNull(user.emailVerifiedAt)
  })

  test('login user after verification', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test3@example.com',
      password: 'password123',
    })

    const role = await Role.findBy('slug', 'affiliate')
    await user.related('roles').attach([role!.id])

    // Attempting login before verification should fail
    const failResponse = await client.post('/api/v1/auth/login').json({
      email: 'test3@example.com',
      password: 'password123',
    })
    failResponse.assertStatus(403)

    // Mark verified
    user.emailVerifiedAt = DateTime.now()
    user.status = UserStatus.ACTIVE
    await user.save()

    // Successful login
    const successResponse = await client.post('/api/v1/auth/login').json({
      email: 'test3@example.com',
      password: 'password123',
    })
    successResponse.assertStatus(200)
    successResponse.assertBodyContains({ success: true })
  })
})
