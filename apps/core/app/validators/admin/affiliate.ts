import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { UserStatus } from '#enums/user_status'

export const createAffiliateValidator = vine.create(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255),
    companyName: vine.string().trim().maxLength(255).optional(),
    email: vine.string().email().maxLength(254).unique({ table: 'users', column: 'email' }),
    password: vine.string().minLength(8).maxLength(32),
    status: vine.enum(UserStatus).optional(),
    meta: vine.any().optional(),
  })
)

export const updateAffiliateValidator = vine.create(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255).optional(),
    companyName: vine.string().trim().maxLength(255).optional(),
    email: vine.string().email().maxLength(254).optional(),
    status: vine.enum(UserStatus).optional(),
    meta: vine.any().optional(),
  })
)

export type CreateAffiliateDto = Infer<typeof createAffiliateValidator>
export type UpdateAffiliateDto = Infer<typeof updateAffiliateValidator>
