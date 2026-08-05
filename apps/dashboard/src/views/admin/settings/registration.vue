<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettings } from '@/composables/use-settings'
import { Save } from '@lucide/vue'

const { loading, errorMsg, validationErrors, getSettingsByGroup, updateSettingsByGroup } = useSettings()

const formState = ref<Record<string, any>>({
  allow_registration: true,
  require_approval: true,
  registration_fields: []
})

onMounted(async () => {
  const data = await getSettingsByGroup('registration')
  if (data) {
    // Merge fetched settings into our reactive form state
    Object.assign(formState.value, data)
  }
})

const onFinish = async () => {
  await updateSettingsByGroup('registration', formState.value)
}
</script>

<template>
  <div class="py-4">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-medium">Registration Settings</h2>
        <p class="text-gray-500 text-sm">Manage user signup rules and dynamic registration fields.</p>
      </div>
      <a-button type="primary" :loading="loading" @click="onFinish">
        <template #icon><Save class="w-4 h-4 inline-block align-middle mr-1" /></template>
        Save Changes
      </a-button>
    </div>
    
    <a-alert v-if="errorMsg" type="error" :message="errorMsg" class="mb-4" show-icon />

    <a-form layout="vertical" :model="formState" @finish="onFinish">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <a-form-item 
          label="Allow Public Registration" 
          name="allow_registration"
        >
          <a-switch v-model:checked="formState.allow_registration" />
        </a-form-item>

        <a-form-item 
          label="Require Admin Approval" 
          name="require_approval"
        >
          <a-switch v-model:checked="formState.require_approval" />
        </a-form-item>

      </div>
      
      <!-- Placeholder for dynamic fields builder -->
      <a-card title="Dynamic Registration Fields" class="mt-6" size="small">
        <p class="text-sm text-gray-500 mb-4">You have {{ formState.registration_fields?.length || 0 }} dynamic fields configured. (UI Builder coming soon)</p>
        <pre class="bg-gray-50 p-4 rounded text-xs overflow-auto">{{ formState.registration_fields }}</pre>
      </a-card>
    </a-form>
  </div>
</template>
