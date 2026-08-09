import CommissionPlanTier from '#models/commission_plan_tier'
import type {
  CreateCommissionPlanTierDto,
  UpdateCommissionPlanTierDto,
} from '#validators/admin/commission_plan_tier'

export default class CommissionPlanTierService {
  async getTiers(page: number, limit: number) {
    return CommissionPlanTier.query().orderBy('minValue', 'asc').paginate(page, limit)
  }

  async getTier(id: string) {
    return CommissionPlanTier.findOrFail(id)
  }

  async createTier(payload: CreateCommissionPlanTierDto) {
    return CommissionPlanTier.create({
      ...payload,
      minValue: payload.minValue.toString(),
      maxValue: payload.maxValue.toString(),
      revsharePercentage: payload.revsharePercentage.toString(),
      cpaAmount: payload.cpaAmount.toString(),
    })
  }

  async updateTier(id: string, payload: UpdateCommissionPlanTierDto) {
    const tier = await this.getTier(id)
    tier.merge({
      ...payload,
      minValue: payload.minValue?.toString(),
      maxValue: payload.maxValue?.toString(),
      revsharePercentage: payload.revsharePercentage?.toString(),
      cpaAmount: payload.cpaAmount?.toString(),
    })
    await tier.save()

    return tier
  }

  async deleteTier(id: string) {
    const tier = await this.getTier(id)
    await tier.delete()
  }
}
