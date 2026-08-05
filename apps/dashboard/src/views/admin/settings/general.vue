<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSettings } from '@/composables/use-settings'
import { Save } from '@lucide/vue'

const { loading, errorMsg, validationErrors, getSettingsByGroup, updateSettingsByGroup } = useSettings()

const formState = ref<Record<string, any>>({
  site_name: '',
  site_description: '',
  support_email: '',
})

onMounted(async () => {
  const data = await getSettingsByGroup('general')
  if (data) {
    // Merge fetched settings into our reactive form state
    Object.assign(formState.value, data)
  }
})

const onFinish = async () => {
  await updateSettingsByGroup('general', formState.value)
}
</script>

<template>
  <div class="py-4">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-medium">General Settings</h2>
        <p class="text-gray-500 text-sm">Manage your core company information and site details.</p>
      </div>
      <a-button type="primary" :loading="loading" @click="onFinish">
        <template #icon><Save class="w-4 h-4 inline-block align-middle mr-1" /></template>
        Save Changes
      </a-button>
    </div>

    <!-- TODO: Add dynamic settings fields based on your schema here -->
    
    <a-alert v-if="errorMsg" type="error" :message="errorMsg" class="mb-4" show-icon />

    <a-form layout="vertical" :model="formState" @finish="onFinish">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <a-form-item 
          label="Site Name" 
          name="site_name"
          :validate-status="validationErrors.site_name ? 'error' : ''"
          :help="validationErrors.site_name"
        >
          <a-input v-model:value="formState.site_name" placeholder="Enter site name" />
        </a-form-item>

        <a-form-item 
          label="Support Email" 
          name="support_email"
          :validate-status="validationErrors.support_email ? 'error' : ''"
          :help="validationErrors.support_email"
        >
          <a-input v-model:value="formState.support_email" placeholder="Enter support email" />
        </a-form-item>

      </div>
    </a-form>
  </div>
</template>
