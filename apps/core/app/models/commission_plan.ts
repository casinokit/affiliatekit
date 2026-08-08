import { CommissionPlanSchema } from '#database/schema'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from '@drago1204/adonis-lucid-soft-deletes'
import { CommissionType } from '#enums/commission_type'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import CommissionPlanTier from '#models/commission_plan_tier'
import CommissionPlanAssignment from '#models/commission_plan_assignment'

export default class CommissionPlan extends compose(CommissionPlanSchema, SoftDeletes) {
  declare model: CommissionType

  @hasMany(() => CommissionPlanTier)
  declare tiers: HasMany<typeof CommissionPlanTier>

  @hasMany(() => CommissionPlanAssignment)
  declare assignments: HasMany<typeof CommissionPlanAssignment>
}
