import User from '#models/user'
import Role from '#models/role'
import PasswordResetToken from '#models/password_reset_token'
import string from '@adonisjs/core/helpers/string'
import { DateTime } from 'luxon'
import type { LoginDto } from '#validators/auth/login'
import type { RegisterDto } from '#validators/auth/register'
import type { ForgotPasswordDto } from '#validators/auth/forgot_password'
import type { ResetPasswordDto } from '#validators/auth/reset_password'
import { Exception } from '@adonisjs/core/exceptions'

// Import Events
import UserRegistered from '#events/auth/user_registered'
import PasswordResetRequested from '#events/auth/password_reset_requested'

export class AuthService {
  async register(payload: RegisterDto) {
    const verificationToken = string.generateRandom(64)

    const { passwordConfirmation, ...userPayload } = payload

    // Create the user with verification token
    const user = await User.create({
      ...userPayload,
      emailVerificationToken: verificationToken,
      status: 'pending',
    })

    // Assign default role "Affiliate"
    const affiliateRole = await Role.findBy('slug', 'affiliate')
    if (affiliateRole) {
      await user.related('roles').attach([affiliateRole.id])
    }

    const token = await User.accessTokens.create(user)

    // Broadcast Event
    await UserRegistered.dispatch(user)

    return { user, token }
  }

  async verifyEmail(token: string) {
    const user = await User.findBy('emailVerificationToken', token)
    if (!user) {
      throw new Exception('Invalid or expired verification token', { status: 400 })
    }

    user.emailVerificationToken = null
    user.emailVerifiedAt = DateTime.now()
    user.status = 'active'
    await user.save()

    return user
  }

  async login(payload: LoginDto) {
    const user = await User.verifyCredentials(payload.email, payload.password)

    if (!user.emailVerifiedAt) {
      throw new Exception('Please verify your email address before logging in', { status: 403 })
    }

    const token = await User.accessTokens.create(user)

    return { user, token }
  }

  async logout(user: User) {
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const user = await User.findBy('email', payload.email)
    if (!user) {
      return null
    }

    const resetToken = string.generateRandom(64)

    await PasswordResetToken.create({
      email: user.email,
      token: resetToken,
      expiresAt: DateTime.now().plus({ hours: 1 }),
    })

    // Broadcast Event
    await PasswordResetRequested.dispatch(user, resetToken)

    return { token: resetToken }
  }

  async resetPassword(payload: ResetPasswordDto) {
    const resetToken = await PasswordResetToken.query()
      .where('email', payload.email)
      .where('token', payload.token)
      .where('expiresAt', '>', DateTime.now().toSQL()!)
      .first()

    if (!resetToken) {
      throw new Exception('Invalid or expired token', { status: 400 })
    }

    const user = await User.findByOrFail('email', payload.email)
    user.password = payload.password
    await user.save()

    await PasswordResetToken.query().where('email', payload.email).delete()

    return user
  }
}
