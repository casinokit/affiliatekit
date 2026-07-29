import { inject } from '@adonisjs/core'
import { AuthService } from '#services/auth_service'
import { registerValidator } from '#validators/auth/register'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

@inject()
export default class RegisterController {
  constructor(protected authService: AuthService) {}

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const { user, token } = await this.authService.register(payload)

    return response.success(
      'Registration successful',
      {
        user: UserTransformer.transform(user),
        token: token.value!.release(),
      },
      201
    )
  }
}
