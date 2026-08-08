import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createCommissionPlanTierValidator = vine.create(
  vine.object({
    commissionPlanId: vine.string().uuid(),
    minValue: vine.number().min(0),
    maxValue: vine.number().min(0),
    revsharePercentage: vine.number().min(0).max(100),
    cpaAmount: vine.number().min(0),
  })
)

export const updateCommissionPlanTierValidator = vine.create(
  vine.object({
    commissionPlanId: vine.string().uuid().optional(),
    minValue: vine.number().min(0).optional(),
    maxValue: vine.number().min(0).optional(),
    revsharePercentage: vine.number().min(0).max(100).optional(),
    cpaAmount: vine.number().min(0).optional(),
  })
)

export type CreateCommissionPlanTierDto = Infer<typeof createCommissionPlanTierValidator>
export type UpdateCommissionPlanTierDto = Infer<typeof updateCommissionPlanTierValidator>
