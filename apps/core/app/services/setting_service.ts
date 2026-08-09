import Setting from '#models/setting'
import type { UpdateSettingByKeyDto } from '#validators/admin/setting'

export class SettingService {
  /**
   * Get all settings for a specific group
   */
  async getSettingsByGroup(group: string) {
    const settings = await Setting.query().where('group', group)

    // Transform from array of rows to a simple key/value object
    const result: Record<string, any> = {}
    for (const setting of settings) {
      result[setting.key] = setting.value
    }

    return result
  }

  /**
   * Bulk update settings for a group
   */
  async updateSettingsByGroup(group: string, payload: Record<string, any>) {
    const keys = Object.keys(payload)

    for (const key of keys) {
      const value = payload[key]

      // Upsert the setting
      await Setting.updateOrCreate({ key, group }, { name: this.formatName(key), value })
    }
  }

  /**
   * Update a single setting by key
   */
  async updateSettingByKey(key: string, payload: UpdateSettingByKeyDto) {
    await Setting.updateOrCreate({ key }, { name: this.formatName(key), value: payload.value })
  }

  /**
   * Helper to generate a human readable name from a snake_case key
   */
  private formatName(key: string) {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}
