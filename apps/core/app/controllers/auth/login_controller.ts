import { inject } from '@adonisjs/core'
import { AuthService } from '#services/auth_service'
import { loginValidator } from '#validators/auth/login'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import { UAParser } from 'ua-parser-js'

@inject()
export default class LoginController {
  constructor(protected authService: AuthService) {}

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const rawUserAgent = request.header('user-agent') || ''
    const ipAddress = request.ip() || 'Unknown IP'
    
    let deviceName = 'Unknown Device'
    if (rawUserAgent) {
      const parser = new UAParser(rawUserAgent)
      const browser = parser.getBrowser()
      const os = parser.getOS()
      
      const osName = os.name ? os.name : 'Unknown OS'
      const browserName = browser.name ? browser.name : 'Unknown Browser'
      
      deviceName = `${osName} • ${browserName} (${ipAddress})`
    } else {
      deviceName = `Unknown Device (${ipAddress})`
    }

    const { token } = await this.authService.login(payload, deviceName)

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
