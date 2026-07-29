import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const password = () => vine.string().minLength(8).maxLength(32)

export const resetPasswordValidator = vine.create({
  token: vine.string(),
  email: vine.string().email().maxLength(254),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

export type ResetPasswordDto = Infer<typeof resetPasswordValidator>
