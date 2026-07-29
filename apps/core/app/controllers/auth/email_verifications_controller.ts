import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { AuthService } from '#services/auth_service'

@inject()
export default class EmailVerificationsController {
  constructor(protected authService: AuthService) {}

  async verify({ request, response }: HttpContext) {
    const token = request.input('token')
    
    if (!token) {
      return response.fail('Verification token is required', 400)
    }

    try {
      await this.authService.verifyEmail(token)
      return response.success('Email verified successfully')
    } catch (error: any) {
      return response.fail(error.message, 400)
    }
  }
}