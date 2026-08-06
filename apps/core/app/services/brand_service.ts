import Brand from '#models/brand'
import stringHelpers from '@adonisjs/core/helpers/string'
import type { CreateBrandDto, UpdateBrandDto } from '#validators/admin/brand'

export default class BrandService {
  /**
   * Get paginated list of brands
   */
  async getBrands(page: number, limit: number, search?: string) {
    const query = Brand.query().orderBy('createdAt', 'desc')

    if (search) {
      query.whereILike('name', `%${search}%`)
    }

    return query.paginate(page, limit)
  }

  /**
   * Find a single brand by ID
   */
  async getBrand(id: number) {
    return Brand.findOrFail(id)
  }

  /**
   * Create a new brand
   */
  async createBrand(payload: CreateBrandDto) {
    const securityCode = stringHelpers.generateRandom(32)

    return Brand.create({
      ...payload,
      status: payload.status || 'active',
      securityCode,
    })
  }

  /**
   * Update an existing brand
   */
  async updateBrand(id: number, payload: UpdateBrandDto) {
    const brand = await this.getBrand(id)
    brand.merge(payload)
    await brand.save()

    return brand
  }

  /**
   * Delete a brand (Soft Delete)
   */
  async deleteBrand(id: number) {
    const brand = await this.getBrand(id)
    await brand.delete()
  }

  /**
   * Force delete a brand (Hard Delete)
   */
  async forceDeleteBrand(id: number) {
    const brand = (await Brand.withTrashed().where('id', id).firstOrFail()) as Brand
    await brand.forceDelete()
  }
}
