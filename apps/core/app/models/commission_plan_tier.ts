import { CommissionPlanTierSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import CommissionPlan from '#models/commission_plan'

export default class CommissionPlanTier extends CommissionPlanTierSchema {
  @belongsTo(() => CommissionPlan)
  declare commissionPlan: BelongsTo<typeof CommissionPlan>
}
