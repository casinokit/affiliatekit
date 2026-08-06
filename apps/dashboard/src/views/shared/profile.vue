<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useRoute } from 'vue-router'
import { api } from '@/lib/tuyau'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/use-auth'
import { Save, LogOut } from '@lucide/vue'

const route = useRoute()
const authStore = useAuthStore()
const { logoutAll } = useAuth()

// Dynamically compute the breadcrumb portal name based on the current route
const portalName = computed(() => {
  return route.path.startsWith('/admin') ? 'Admin' : 'Affiliate'
})

// Profile Form State
const profileLoading = ref(false)
const profileErrors = ref<Record<string, string>>({})
const profileForm = ref({
  fullName: '',
  companyName: '',
  meta: {},
})

const profileRules: Record<string, Rule[]> = {
  fullName: [{ required: true, message: 'Please enter your full name' }],
}

// Password Form State
const passwordLoading = ref(false)
const passwordErrors = ref<Record<string, string>>({})
const passwordForm = ref({
  currentPassword: '',
  password: '',
  password_confirmation: '',
})

const passwordRules: Record<string, Rule[]> = {
  currentPassword: [{ required: true, message: 'Please enter your current password' }],
  password: [
    { required: true, message: 'Please enter a new password' },
    { min: 8, message: 'Password must be at least 8 characters' },
  ],
  password_confirmation: [
    { required: true, message: 'Please confirm your new password' },
    {
      validator: async (_rule: Rule, value: string) => {
        if (value && value !== passwordForm.value.password) {
          return Promise.reject('Passwords do not match')
        }
        return Promise.resolve()
      },
    },
  ],
}

// Sessions State
const logoutLoading = ref(false)
const sessionsLoading = ref(false)
const activeSessions = ref<any[]>([])

const fetchSessions = async () => {
  sessionsLoading.value = true
  try {
    const response = await api.request('account.sessions.index' as any, {})
    const { sessions } = response as any
    activeSessions.value = sessions || []
  } catch (err: any) {
    console.error('Fetch sessions error:', err, err.response)
    message.error(err.response?.message || err.message || 'Failed to load active sessions')
  } finally {
    sessionsLoading.value = false
  }
}

onMounted(async () => {
  if (authStore.user) {
    profileForm.value.fullName = authStore.user.fullName || ''
    profileForm.value.companyName = authStore.user.companyName || ''
    profileForm.value.meta = authStore.user.meta || {}
  }
  await fetchSessions()
})

const onUpdateProfile = async () => {
  profileLoading.value = true
  profileErrors.value = {}

  try {
    const payload: Record<string, any> = {
      fullName: profileForm.value.fullName,
      companyName: profileForm.value.companyName,
      meta: profileForm.value.meta,
    }

    const response = await api.request('account.profile.update' as any, {
      body: payload,
    })

    const { user, message: msg } = response as any

    if (user) {
      authStore.setUser(user)
    }

    message.success(msg || 'Profile updated successfully')
  } catch (err: any) {
    if (err.response?.errors && Array.isArray(err.response.errors)) {
      const formattedErrors: Record<string, string> = {}
      err.response.errors.forEach((e: any) => {
        formattedErrors[e.field] = e.message
      })
      profileErrors.value = formattedErrors
      message.error(err.response?.message || 'Validation failed. Please check your inputs.')
    } else {
      message.error(err.response?.message || err.message || 'Failed to update profile')
    }
  } finally {
    profileLoading.value = false
  }
}

const onUpdatePassword = async () => {
  passwordLoading.value = true
  passwordErrors.value = {}

  try {
    const response = await api.request('account.password.update' as any, {
      body: {
        currentPassword: passwordForm.value.currentPassword,
        password: passwordForm.value.password,
        password_confirmation: passwordForm.value.password_confirmation,
      },
    })

    const { message: msg } = response as any
    message.success(msg || 'Password updated successfully')

    // Clear password fields
    passwordForm.value.currentPassword = ''
    passwordForm.value.password = ''
    passwordForm.value.password_confirmation = ''
  } catch (err: any) {
    if (err.response?.errors && Array.isArray(err.response.errors)) {
      const formattedErrors: Record<string, string> = {}
      err.response.errors.forEach((e: any) => {
        formattedErrors[e.field] = e.message
      })
      passwordErrors.value = formattedErrors
      message.error(err.response?.message || 'Validation failed. Please check your inputs.')
    } else {
      message.error(err.response?.message || err.message || 'Failed to update password')
    }
  } finally {
    passwordLoading.value = false
  }
}

const onLogoutAll = async () => {
  logoutLoading.value = true
  try {
    await logoutAll()
  } catch (err: any) {
    // Error is handled by useAuth composable
  } finally {
    logoutLoading.value = false
  }
}

const onLogoutSession = async (id: string) => {
  try {
    const response = await api.request('account.sessions.destroy' as any, {
      params: { id },
    })
    const { message: msg } = response as any
    message.success(msg || 'Session revoked successfully')

    // Refresh sessions
    await fetchSessions()
  } catch (err: any) {
    message.error(err.response?.message || 'Failed to revoke session')
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}
</script>

<template>
  <!-- Breadcrumb -->
  <a-breadcrumb class="!mb-6" separator=">">
    <a-breadcrumb-item>{{ portalName }}</a-breadcrumb-item>
    <a-breadcrumb-item>Account</a-breadcrumb-item>
    <a-breadcrumb-item>Profile</a-breadcrumb-item>
  </a-breadcrumb>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
    <!-- Left Column (Personal Info & Sessions) -->
    <div class="flex flex-col space-y-6">
      <!-- Personal Information Section -->
      <a-card :bordered="false" class="shadow-sm mb-6!" title="Personal Information">
        <a-form
          layout="vertical"
          :model="profileForm"
          :rules="profileRules"
          @finish="onUpdateProfile"
        >
          <div class="space-y-4">
            <a-form-item label="Email Address" class="md:w-1/2">
              <a-input :value="authStore.user?.email" disabled />
            </a-form-item>

            <a-form-item
              label="Full Name"
              name="fullName"
              class="md:w-1/2"
              :validate-status="profileErrors.fullName ? 'error' : ''"
              :help="profileErrors.fullName"
            >
              <a-input v-model:value="profileForm.fullName" placeholder="Enter your full name" />
            </a-form-item>

            <a-form-item
              label="Company Name"
              name="companyName"
              class="md:w-1/2"
              :validate-status="profileErrors.companyName ? 'error' : ''"
              :help="profileErrors.companyName"
            >
              <a-input
                v-model:value="profileForm.companyName"
                placeholder="Enter your company name"
              />
            </a-form-item>
          </div>

          <div class="flex justify-start mt-4">
            <a-button type="primary" :loading="profileLoading" @click="onUpdateProfile">
              <template #icon><Save class="w-4 h-4 inline-block align-middle mr-1" /></template>
              Save Information
            </a-button>
          </div>
        </a-form>
      </a-card>

      <!-- Active Sessions Section -->
      <a-card :bordered="false" class="shadow-sm" title="Active Sessions">
        <a-list
          :loading="sessionsLoading"
          item-layout="horizontal"
          :data-source="activeSessions"
          class="mb-6 flex-1"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-button
                  v-if="!item.isCurrent"
                  type="text"
                  danger
                  size="small"
                  @click="onLogoutSession(item.id)"
                >
                  Log out
                </a-button>
              </template>
              <a-list-item-meta>
                <template #title>
                  <span class="font-medium text-gray-800">{{ item.name }}</span>
                  <a-tag v-if="item.isCurrent" color="green" class="ml-2">Current Session</a-tag>
                </template>
                <template #description>
                  <span class="text-xs text-gray-500"
                    >Last used: {{ formatDate(item.lastUsedAt) }}</span
                  >
                </template>
                <template #avatar>
                  <div
                    class="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200"
                  >
                    <LogOut class="w-4 h-4 text-gray-400" />
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>

        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-red-50 rounded-lg mt-auto"
        >
          <div>
            <p class="text-red-800 m-0 text-sm">
              If you notice any suspicious activity, you can log out of all devices.
            </p>
          </div>
          <a-button danger :loading="logoutLoading" @click="onLogoutAll">
            <template #icon><LogOut class="w-4 h-4 inline-block align-middle mr-1" /></template>
            Logout All
          </a-button>
        </div>
      </a-card>
    </div>

    <!-- Right Column (Security) -->
    <div class="flex flex-col space-y-6">
      <!-- Security Section -->
      <a-card :bordered="false" class="shadow-sm" title="Change Password">
        <a-form
          layout="vertical"
          :model="passwordForm"
          :rules="passwordRules"
          @finish="onUpdatePassword"
        >
          <div class="space-y-1">
            <a-form-item
              label="Current Password"
              name="currentPassword"
              class="md:w-1/2"
              :validate-status="passwordErrors.currentPassword ? 'error' : ''"
              :help="passwordErrors.currentPassword"
            >
              <a-input-password
                v-model:value="passwordForm.currentPassword"
                placeholder="Enter your current password"
              />
            </a-form-item>

            <a-form-item
              label="New Password"
              name="password"
              class="md:w-1/2"
              :validate-status="passwordErrors.password ? 'error' : ''"
              :help="passwordErrors.password"
            >
              <a-input-password
                v-model:value="passwordForm.password"
                placeholder="Enter new password"
              />
            </a-form-item>

            <a-form-item label="Confirm New Password" name="password_confirmation" class="md:w-1/2">
              <a-input-password
                v-model:value="passwordForm.password_confirmation"
                placeholder="Confirm new password"
              />
            </a-form-item>
          </div>

          <div class="flex justify-start mt-4">
            <a-button type="primary" :loading="passwordLoading" @click="onUpdatePassword">
              <template #icon><Save class="w-4 h-4 inline-block align-middle mr-1" /></template>
              Update Password
            </a-button>
          </div>
        </a-form>
      </a-card>
    </div>
  </div>
</template>
