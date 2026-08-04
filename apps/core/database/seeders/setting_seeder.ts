import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Setting from '#models/setting'

export default class extends BaseSeeder {
  async run() {
    await Setting.updateOrCreateMany('key', [
      {
        key: 'site_name',
        name: 'Site Name',
        group: 'general',
        value: 'AffiliateKit',
      },
      {
        key: 'registration_fields',
        name: 'Registration Fields',
        group: 'registration',
        value: [
          {
            key: 'im_handler_type',
            label: 'IM Platform',
            type: 'select',
            options: ['Telegram', 'WhatsApp', 'Discord', 'Signal'],
            required: true,
          },
          {
            key: 'im_handler_username',
            label: 'IM Username / Number',
            type: 'text',
            required: true,
          },
          {
            key: 'traffic_source',
            label: 'Primary Traffic Source',
            type: 'select',
            options: ['SEO', 'Social Media', 'Paid Ads', 'Email', 'Other'],
            required: true,
          },
        ],
      },
    ])
  }
}
