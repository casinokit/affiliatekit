import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const forgotPasswordValidator = vine.create({
  email: vine.string().email().maxLength(254),
})

export type ForgotPasswordDto = Infer<typeof forgotPasswordValidator>
