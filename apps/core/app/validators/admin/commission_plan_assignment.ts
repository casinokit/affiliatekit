import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

export const createCommissionPlanAssignmentValidator = vine.create(
  vine.object({
    programId: vine.string().uuid(),
    brandId: vine.string().uuid().optional(),
    affiliateId: vine.string().uuid().optional(),
    commissionPlanId: vine.string().uuid(),
    status: vine.string().trim().minLength(1).maxLength(50).optional(),
    startsAt: vine.date().optional(),
    endsAt: vine.date().optional(),
  })
)

export const updateCommissionPlanAssignmentValidator = vine.create(
  vine.object({
    programId: vine.string().uuid().optional(),
    brandId: vine.string().uuid().optional(),
    affiliateId: vine.string().uuid().optional(),
    commissionPlanId: vine.string().uuid().optional(),
    status: vine.string().trim().minLength(1).maxLength(50).optional(),
    startsAt: vine.date().optional(),
    endsAt: vine.date().optional(),
  })
)

export type CreateCommissionPlanAssignmentDto = Infer<
  typeof createCommissionPlanAssignmentValidator
>
export type UpdateCommissionPlanAssignmentDto = Infer<
  typeof updateCommissionPlanAssignmentValidator
>
