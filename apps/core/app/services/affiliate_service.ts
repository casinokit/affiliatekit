import User from '#models/user'
import Role from '#models/role'
import type { CreateAffiliateDto, UpdateAffiliateDto } from '#validators/admin/affiliate'
import { UserStatus } from '#enums/user_status'
import { Exception } from '@adonisjs/core/exceptions'

export default class AffiliateService {
  async getAffiliates(page: number, limit: number, search?: string, status?: UserStatus) {
    const query = this.affiliateQuery().orderBy('createdAt', 'desc')

    if (search) {
      query.where((searchQuery) => {
        searchQuery
          .whereILike('fullName', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('companyName', `%${search}%`)
      })
    }

    if (status) {
      query.where('status', status)
    }

    return query.paginate(page, limit)
  }

  async getAffiliate(id: string) {
    return this.affiliateQuery().where('users.id', id).firstOrFail()
  }

  async createAffiliate(payload: CreateAffiliateDto) {
    const { status, ...affiliatePayload } = payload
    const affiliate = await User.create({
      ...affiliatePayload,
      status: status || UserStatus.PENDING,
    })

    await this.attachAffiliateRole(affiliate)

    return affiliate
  }

  async updateAffiliate(id: string, payload: UpdateAffiliateDto) {
    const affiliate = await this.getAffiliate(id)
    affiliate.merge(payload)
    await affiliate.save()

    return affiliate
  }

  async deleteAffiliate(id: string) {
    const affiliate = await this.getAffiliate(id)
    await affiliate.delete()
  }

  async forceDeleteAffiliate(id: string) {
    const affiliate = (await User.withTrashed()
      .where('users.id', id)
      .whereHas('roles', (roleQuery) => {
        roleQuery.where('slug', 'affiliate')
      })
      .firstOrFail()) as User
    await affiliate.forceDelete()
  }

  private affiliateQuery() {
    return User.query().whereHas('roles', (roleQuery) => {
      roleQuery.where('slug', 'affiliate')
    })
  }

  private async attachAffiliateRole(affiliate: User) {
    const affiliateRole = await Role.findBy('slug', 'affiliate')

    if (!affiliateRole) {
      throw new Exception('Affiliate role is not configured', { status: 500 })
    }

    await affiliate.related('roles').attach([affiliateRole.id])
  }
}
