import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

const password = () => vine.string().minLength(8).maxLength(32)

export const registerValidator = vine.create({
  fullName: vine.string().nullable(),
  email: vine.string().email().maxLength(254).unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

export type RegisterDto = Infer<typeof registerValidator>
