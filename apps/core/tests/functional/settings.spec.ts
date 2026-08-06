import { test } from '@japa/runner'
import User from '#models/user'
import { UserStatus } from '#enums/user_status'
import Role from '#models/role'
import Setting from '#models/setting'

test.group('Settings API', (group) => {
  let adminUser: User

  group.each.setup(async () => {
    const adminRole = await Role.firstOrCreate({ slug: 'admin' }, { name: 'Admin' })

    adminUser = await User.firstOrCreate(
      { email: 'admin_settings@example.com' },
      {
        fullName: 'Admin User',
        password: 'password123',
        status: UserStatus.ACTIVE,
      }
    )
    await adminUser.related('roles').sync([adminRole.id])

    await Setting.createMany([
      { group: 'general', key: 'test_key', name: 'Test Key', value: 'old_value' },
    ])
  })

  group.each.teardown(async () => {
    await Setting.query().delete()
    await User.query().delete()
  })

  test('fetch settings by group', async ({ client }) => {
    const response = await client.get('/api/v1/admin/settings/general').loginAs(adminUser)

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      data: {
        test_key: 'old_value',
      },
    })
  })

  test('update settings by group', async ({ client, assert }) => {
    const response = await client
      .put('/api/v1/admin/settings/group/general')
      .loginAs(adminUser)
      .json({
        settings: {
          test_key: 'new_value',
          dynamic_key: ['an', 'array'],
        }
      })

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'general settings updated successfully',
    })

    const updated = await Setting.findBy('key', 'test_key')
    const added = await Setting.findBy('key', 'dynamic_key')

    assert.equal(updated!.value, 'new_value')
    assert.deepEqual(added!.value, ['an', 'array'])
  })

  test('update setting by key', async ({ client, assert }) => {
    const response = await client
      .put('/api/v1/admin/settings/key/test_key')
      .loginAs(adminUser)
      .json({
        value: 'single_update',
      })

    response.assertStatus(200)
    response.assertBodyContains({
      success: true,
      message: 'Setting updated successfully',
    })

    const updated = await Setting.findBy('key', 'test_key')
    assert.equal(updated!.value, 'single_update')
  })
})
