import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createBrandValidator, updateBrandValidator } from '#validators/admin/brand'
import BrandService from '#services/brand_service'

@inject()
export default class BrandsController {
  constructor(private service: BrandService) {}

  /**
   * Return list of all brands
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search')

    const brands = await this.service.getBrands(page, limit, search)

    return response.success('Brands retrieved successfully', brands)
  }

  /**
   * Create a new brand
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createBrandValidator)

    const brand = await this.service.createBrand(payload)

    return response.success('Brand created successfully', brand, 201)
  }

  /**
   * Show a single brand by id
   */
  async show({ params, response }: HttpContext) {
    const brand = await this.service.getBrand(params.id)

    return response.success('Brand retrieved successfully', brand)
  }

  /**
   * Update brand details
   */
  async update({ params, request, response }: HttpContext) {
    const payload = await request.validateUsing(updateBrandValidator)

    const brand = await this.service.updateBrand(params.id, payload)

    return response.success('Brand updated successfully', brand)
  }

  /**
   * Delete or deactivate a brand (Soft Delete)
   */
  async destroy({ params, response }: HttpContext) {
    await this.service.deleteBrand(params.id)

    return response.success('Brand deleted successfully')
  }

  /**
   * Permanently delete a brand
   */
  async forceDestroy({ params, response }: HttpContext) {
    await this.service.forceDeleteBrand(params.id)

    return response.success('Brand permanently deleted')
  }
}
