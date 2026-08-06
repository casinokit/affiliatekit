import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import { updateProfileValidator, updatePasswordValidator } from '#validators/shared/profile'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class ProfileController {
  /**
   * Get the current user's profile
   */
  async show({ auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    return serialize(UserTransformer.transform(user))
  }

  /**
   * Get the current user's active sessions (tokens)
   */
  async sessions({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const tokens = await User.accessTokens.all(user)

    // Format tokens to just return essential info
    const formattedTokens = tokens.map(token => ({
      id: token.identifier,
      name: token.name || 'Unknown Device',
      lastUsedAt: token.lastUsedAt,
      createdAt: token.createdAt,
      isCurrent: user.currentAccessToken?.identifier === token.identifier
    }))

    return response.ok({
      success: true,
      sessions: formattedTokens
    })
  }

  /**
   * Delete a specific active session (token)
   */
  async destroySession({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const tokenId = request.param('id')

    if (!tokenId) {
      return response.badRequest({ message: 'Session ID is required' })
    }

    // Attempt to delete the token. AccessTokens provider handles verifying ownership if you use user
    await User.accessTokens.delete(user, tokenId)

    return response.ok({
      success: true,
      message: 'Session revoked successfully'
    })
  }

  /**
   * Update the current user's profile
   */
  async update({ auth, request, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updateProfileValidator)

    if (payload.fullName) {
      user.fullName = payload.fullName
    }
    
    if (payload.companyName) {
      user.companyName = payload.companyName
    }

    if (payload.meta) {
      user.meta = {
        ...(user.meta || {}),
        ...payload.meta
      }
    }

    await user.save()

    return response.ok({
      success: true,
      message: 'Profile updated successfully',
      user: serialize(UserTransformer.transform(user))
    })
  }

  /**
   * Update the current user's password
   */
  async updatePassword({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const payload = await request.validateUsing(updatePasswordValidator)

    const isValid = await hash.verify(user.password, payload.currentPassword)
    if (!isValid) {
      return response.badRequest({
        errors: [
          {
            field: 'currentPassword',
            message: 'Current password is incorrect'
          }
        ]
      })
    }

    user.password = payload.password
    await user.save()

    return response.ok({
      success: true,
      message: 'Password updated successfully'
    })
  }
}
