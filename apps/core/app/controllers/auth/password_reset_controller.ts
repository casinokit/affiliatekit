import { inject } from '@adonisjs/core'
import { AuthService } from '#services/auth_service'
import { forgotPasswordValidator } from '#validators/auth/forgot_password'
import { resetPasswordValidator } from '#validators/auth/reset_password'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class PasswordResetController {
  constructor(protected authService: AuthService) {}

  async forgot({ request, response }: HttpContext) {
    const payload = await request.validateUsing(forgotPasswordValidator)

    // Will return null if user doesn't exist to prevent email enumeration
    const result = await this.authService.forgotPassword(payload)

    return response.success(
      'If that email exists in our system, a password reset link has been sent.',
      result ? { _token: result.token } : undefined
    )
  }

  async reset({ request, response }: HttpContext) {
    const payload = await request.validateUsing(resetPasswordValidator)

    try {
      await this.authService.resetPassword(payload)
      return response.success('Password has been successfully reset.')
    } catch (error: any) {
      // The exception handler will pick this up automatically if we threw it,
      // but if we catch it, we use fail() manually.
      return response.fail(error.message, 400)
    }
  }
}
