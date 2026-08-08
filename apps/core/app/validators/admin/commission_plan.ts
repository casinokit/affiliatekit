import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { CommissionType } from '#enums/commission_type'

export const createCommissionPlanValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    model: vine.enum(CommissionType).optional(),
    revsharePercentage: vine.number().min(0).max(100).optional(),
    cpaAmount: vine.number().min(0).optional(),
    cpaTriggerDeposit: vine.number().min(0).optional(),
    cpaTriggerWager: vine.number().min(0).optional(),
    hasNegativeCarryover: vine.boolean().optional(),
    isTiered: vine.boolean().optional(),
  })
)

export const updateCommissionPlanValidator = vine.create(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    model: vine.enum(CommissionType).optional(),
    revsharePercentage: vine.number().min(0).max(100).optional(),
    cpaAmount: vine.number().min(0).optional(),
    cpaTriggerDeposit: vine.number().min(0).optional(),
    cpaTriggerWager: vine.number().min(0).optional(),
    hasNegativeCarryover: vine.boolean().optional(),
    isTiered: vine.boolean().optional(),
  })
)

export type CreateCommissionPlanDto = Infer<typeof createCommissionPlanValidator>
export type UpdateCommissionPlanDto = Infer<typeof updateCommissionPlanValidator>
