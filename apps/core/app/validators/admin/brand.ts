import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

/**
 * Validates the brand creation action
 */
export const createBrandValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    logo: vine.string().trim().url().optional(),
    url: vine.string().trim().url().optional(),
    status: vine.enum(['active', 'inactive']).optional(),
    ipWhitelist: vine.array(vine.string().trim()).optional(),
  })
)

/**
 * Validates the brand update action
 */
export const updateBrandValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    logo: vine.string().trim().url().optional(),
    url: vine.string().trim().url().optional(),
    status: vine.enum(['active', 'inactive']).optional(),
    ipWhitelist: vine.array(vine.string().trim()).optional(),
  })
)

export type CreateBrandDto = Infer<typeof createBrandValidator>
export type UpdateBrandDto = Infer<typeof updateBrandValidator>
