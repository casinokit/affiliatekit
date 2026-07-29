import { inject } from '@adonisjs/core'
import { AuthService } from '#services/auth_service'
import { loginValidator } from '#validators/auth/login'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

@inject()
export default class LoginController {
  constructor(protected authService: AuthService) {}

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const { user, token } = await this.authService.login(payload)

    return response.success('Logged in successfully', {
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await this.authService.logout(user)

    return response.success('Logged out successfully')
  }
}
