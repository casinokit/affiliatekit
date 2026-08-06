import vine from '@vinejs/vine'

/**
 * Validates the profile update payload
 */
export const updateProfileValidator = vine.create(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(100).optional(),
    companyName: vine.string().trim().maxLength(100).optional(),
    meta: vine.record(vine.any()).optional(),
  })
)

/**
 * Validates the password update payload
 */
export const updatePasswordValidator = vine.create(
  vine.object({
    currentPassword: vine.string(),
    password: vine.string().minLength(8).confirmed(),
  })
)
