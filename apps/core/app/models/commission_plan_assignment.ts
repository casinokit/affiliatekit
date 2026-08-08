import { CommissionPlanAssignmentSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import CommissionPlan from '#models/commission_plan'

export default class CommissionPlanAssignment extends CommissionPlanAssignmentSchema {
  @belongsTo(() => User, {
    foreignKey: 'affiliateId',
  })
  declare affiliate: BelongsTo<typeof User>

  @belongsTo(() => CommissionPlan)
  declare commissionPlan: BelongsTo<typeof CommissionPlan>
}
