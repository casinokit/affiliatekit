import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/tuyau.ts'
import { normalizeApiError } from '@/lib/api-error.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { message } from 'ant-design-vue'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const loading = ref(false)
  const errorMsg = ref('')
  const validationErrors = ref<Record<string, string>>({})

  const clearErrors = () => {
    errorMsg.value = ''
    validationErrors.value = {}
  }

  const handleApiError = (err: any, defaultMsg: string) => {
    const normalized = normalizeApiError(err, defaultMsg)
    validationErrors.value = normalized.fieldErrors
    errorMsg.value = normalized.message
    throw new Error(normalized.message)
  }

  const login = async (credentials: any) => {
    loading.value = true
    clearErrors()
    try {
      // 1. Hit the backend login endpoint
      const response = await api.request('auth.login.store', {
        body: credentials,
        headers: { 'X-Silent-Errors': 'true' },
      })

      const { data } = response as any
      const { token } = data

      // 2. Store token securely FIRST so that subsequent API requests are authenticated
      authStore.setToken(token) // Make sure to pass the raw token string

      // 3. Fetch the user profile using auth/me
      const meResponse = await api.request('auth.login.me' as any, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const { data: meData } = meResponse as any
      const user = meData.user.transformerData ? meData.user.transformerData[0] : meData.user

      // 4. Store user securely
      authStore.setUser(user)

      void message.success('Logged in successfully!')

      // 5. Role-based redirection
      if (user.roles.includes('admin')) {
        await router.push('/admin')
      } else {
        await router.push('/affiliate')
      }
    } catch (err: any) {
      handleApiError(err, 'Login failed. Please check your credentials.')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    clearErrors()
    try {
      await api.request('auth.login.destroy', {})
    } catch (err) {
      console.error("API logout failed, clearing client-side session regardless.", err)
    } finally {
      authStore.logout()
      await router.push({ name: 'auth.login' })
      loading.value = false
      void message.info('Logged out successfully')
    }
  }

  const logoutAll = async () => {
    loading.value = true
    clearErrors()
    try {
      await api.request('auth.login.destroyAll' as any, {})
    } catch (err) {
      console.error("API global logout failed, clearing client-side session regardless.", err)
    } finally {
      authStore.logout()
      await router.push({ name: 'auth.login' })
      loading.value = false
      void message.info('Logged out of all devices successfully')
    }
  }

  const register = async (payload: any) => {
    loading.value = true
    clearErrors()
    try {
      await api.request('auth.register.store', {
        body: payload,
      })

      // Instead of redirecting, we return true to let the component hide the form
      return true
    } catch (err: any) {
      handleApiError(err, 'Registration failed.')
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (payload: { email: string }) => {
    loading.value = true
    clearErrors()
    try {
      await api.request('auth.password_reset.forgot', {
        body: payload,
      })
    } catch (err: any) {
      handleApiError(err, 'Failed to send reset email.')
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (payload: any) => {
    loading.value = true
    errorMsg.value = ''
    try {
      await api.request('auth.password_reset.reset', {
        body: payload,
      })
      void message.success('Password has been reset successfully!')
      await router.push({ name: 'auth.login' })
    } catch (err: any) {
      const serverMessage = err.response?.message
      errorMsg.value = serverMessage || err.message || 'Failed to reset password.'
      throw new Error(errorMsg.value)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errorMsg,
    validationErrors,
    clearErrors,
    login,
    logout,
    logoutAll,
    register,
    forgotPassword,
    resetPassword,
  }
}
