import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { ProgramStatus } from '#enums/program_status'

/**
 * Validates the program creation action
 */
export const createProgramValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    status: vine.enum(ProgramStatus).optional(),
    brandIds: vine.array(vine.string().uuid()).optional(),
  })
)

/**
 * Validates the program update action
 */
export const updateProgramValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    status: vine.enum(ProgramStatus).optional(),
    brandIds: vine.array(vine.string().uuid()).optional(),
  })
)

export type CreateProgramDto = Infer<typeof createProgramValidator>
export type UpdateProgramDto = Infer<typeof updateProgramValidator>
