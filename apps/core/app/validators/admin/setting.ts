import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'

/**
 * Validates a bulk update payload for a group
 */
export const updateSettingsByGroupValidator = vine.create(
  vine.object({
    settings: vine.record(vine.any()),
  })
)

/**
 * Validates a single key update
 */
export const updateSettingByKeyValidator = vine.create(
  vine.object({
    value: vine.any(),
  })
)

export type UpdateSettingsByGroupDto = Infer<typeof updateSettingsByGroupValidator>
export type UpdateSettingByKeyDto = Infer<typeof updateSettingByKeyValidator>
