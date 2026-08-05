import { ref } from 'vue'
import { api } from '@/lib/tuyau.ts'
import { message } from 'ant-design-vue'

export function useSettings() {
  const loading = ref(false)
  const errorMsg = ref('')
  const validationErrors = ref<Record<string, string>>({})

  const clearErrors = () => {
    errorMsg.value = ''
    validationErrors.value = {}
  }

  const handleApiError = (err: any, defaultMsg: string) => {
    if (err.response?.errors && Array.isArray(err.response.errors)) {
      const errors = err.response.errors
      const formattedErrors: Record<string, string> = {}
      errors.forEach((e: any) => {
        if (!formattedErrors[e.field]) {
          formattedErrors[e.field] = e.message
        }
      })
      validationErrors.value = formattedErrors
      errorMsg.value = err.response?.message || 'Validation failed. Please check your inputs.'
    } else {
      errorMsg.value = err.response?.message || err.message || defaultMsg
    }
    throw new Error(errorMsg.value)
  }

  const getSettingsByGroup = async (group: string) => {
    loading.value = true
    clearErrors()
    try {
      const response = await api.request('settings.get_settings_by_group', {
        params: { group },
      })
      const { data } = response as any
      return data || {}
    } catch (err: any) {
      handleApiError(err, `Failed to load ${group} settings.`)
    } finally {
      loading.value = false
    }
  }

  const updateSettingsByGroup = async (group: string, settings: Record<string, any>) => {
    loading.value = true
    clearErrors()
    try {
      const response = await api.request('settings.update_settings_by_group', {
        params: { group },
        body: { settings },
      })
      
      const { message: msg } = response as any
      message.success(msg || `${group} settings updated successfully`)
      return true
    } catch (err: any) {
      handleApiError(err, `Failed to update ${group} settings.`)
    } finally {
      loading.value = false
    }
  }

  const updateSettingByKey = async (key: string, value: any) => {
    loading.value = true
    clearErrors()
    try {
      const response = await api.request('settings.update_setting_by_key', {
        params: { key },
        body: { value },
      })
      
      const { message: msg } = response as any
      message.success(msg || `Setting updated successfully`)
      return true
    } catch (err: any) {
      handleApiError(err, `Failed to update setting ${key}.`)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errorMsg,
    validationErrors,
    clearErrors,
    getSettingsByGroup,
    updateSettingsByGroup,
    updateSettingByKey,
  }
}
