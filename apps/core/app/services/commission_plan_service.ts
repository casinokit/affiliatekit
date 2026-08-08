import CommissionPlan from '#models/commission_plan'
import type {
  CreateCommissionPlanDto,
  UpdateCommissionPlanDto,
} from '#validators/admin/commission_plan'

export default class CommissionPlanService {
  async getCommissionPlans(page: number, limit: number, search?: string) {
    const query = CommissionPlan.query().orderBy('createdAt', 'desc')

    if (search) {
      query.whereILike('name', `%${search}%`)
    }

    return query.paginate(page, limit)
  }

  async getCommissionPlan(id: string) {
    return CommissionPlan.findOrFail(id)
  }

  async createCommissionPlan(payload: CreateCommissionPlanDto) {
    return CommissionPlan.create(payload)
  }

  async updateCommissionPlan(id: string, payload: UpdateCommissionPlanDto) {
    const commissionPlan = await this.getCommissionPlan(id)
    commissionPlan.merge(payload)
    await commissionPlan.save()

    return commissionPlan
  }

  async deleteCommissionPlan(id: string) {
    const commissionPlan = await this.getCommissionPlan(id)
    await commissionPlan.delete()
  }

  async forceDeleteCommissionPlan(id: string) {
    const commissionPlan = (await CommissionPlan.withTrashed()
      .where('id', id)
      .firstOrFail()) as CommissionPlan
    await commissionPlan.forceDelete()
  }
}
