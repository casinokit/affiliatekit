import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const loginValidator = vine.create({
  email: vine.string().email().maxLength(254),
  password: vine.string().minLength(8).maxLength(32),
})

export type LoginDto = Infer<typeof loginValidator>
