import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.get('/dashboard', () => {
      return { message: 'Welcome to the Admin Portal' }
    })

    // Settings Routes
    router.get('/settings/:group', [controllers.admin.Settings, 'getSettingsByGroup'])
    router.put('/settings/group/:group', [controllers.admin.Settings, 'updateSettingsByGroup'])
    router.put('/settings/key/:key', [controllers.admin.Settings, 'updateSettingByKey'])

    // Programs Routes
    router.resource('programs', controllers.admin.Programs).apiOnly()
    router.delete('programs/:id/force', [controllers.admin.Programs, 'forceDestroy'])

    // Brands Routes
    router.resource('brands', controllers.admin.Brands).apiOnly()
    router.delete('brands/:id/force', [controllers.admin.Brands, 'forceDestroy'])

    // Affiliate Routes
    router.resource('affiliates', controllers.admin.Affiliates).apiOnly()
    router.delete('affiliates/:id/force', [controllers.admin.Affiliates, 'forceDestroy'])
    router.get('affiliates/:id/commission-plans', [controllers.admin.Affiliates, 'commissionPlans'])
    router.post('affiliates/:id/commission-plans', [controllers.admin.Affiliates, 'assignCommissionPlan'])
    router.put(
      'affiliates/:id/commission-plans/:assignmentId',
      [controllers.admin.Affiliates, 'updateCommissionPlan']
    )
    router.delete(
      'affiliates/:id/commission-plans/:assignmentId',
      [controllers.admin.Affiliates, 'removeCommissionPlan']
    )

    // Commission plan routes
    router.resource('commission-plans', controllers.admin.CommissionPlans).apiOnly()
    router.delete('commission-plans/:id/force', [controllers.admin.CommissionPlans, 'forceDestroy'])
    router.resource('commission-plan-tiers', controllers.admin.CommissionPlanTiers).apiOnly()
    router.resource('commission-plan-assignments', controllers.admin.CommissionPlanAssignments).apiOnly()
  })
  .prefix('/api/v1/admin')
  .use(middleware.auth())
  .use(middleware.checkRole(['admin']))
