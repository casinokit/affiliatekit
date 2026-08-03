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

    const { token } = await this.authService.login(payload)

    return response.success('Logged in successfully', {
      token: token.value!.release(),
    })
  }

  async me({ auth, response }: HttpContext) {
    const user = auth.user!
    
    // Eager load the roles and permissions so they are available in the Transformer
    await user.load('roles', (roleQuery) => {
      roleQuery.preload('permissions')
    })
    
    return response.success('User retrieved successfully', {
      user: new UserTransformer(user).toObject(),
    })
  }

  async destroy({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await this.authService.logout(user)

    return response.success('Logged out successfully')
  }

  async destroyAll({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await this.authService.logoutAll(user)
    return response.success('Logged out of all devices successfully')
  }
}
