import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { SettingService } from '#services/setting_service'
import {
  updateSettingsByGroupValidator,
  updateSettingByKeyValidator,
} from '#validators/admin/setting'

@inject()
export default class SettingsController {
  constructor(protected settingService: SettingService) {}

  /**
   * GET /api/v1/admin/settings/:group
   */
  async getSettingsByGroup({ request, response }: HttpContext) {
    const group = request.param('group')
    const settings = await this.settingService.getSettingsByGroup(group)
    return response.success('Settings retrieved successfully', settings)
  }

  /**
   * PUT /api/v1/admin/settings/group/:group
   */
  async updateSettingsByGroup({ request, response }: HttpContext) {
    const group = request.param('group')
    const payload = await request.validateUsing(updateSettingsByGroupValidator)
    const settings = payload.settings

    await this.settingService.updateSettingsByGroup(group, settings)

    return response.success(`${group} settings updated successfully`)
  }

  /**
   * PUT /api/v1/admin/settings/key/:key
   */
  async updateSettingByKey({ request, response }: HttpContext) {
    const key = request.param('key')
    const payload = await request.validateUsing(updateSettingByKeyValidator)

    await this.settingService.updateSettingByKey(key, payload)

    return response.success(`Setting updated successfully`)
  }
}
