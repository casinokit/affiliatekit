<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const form = ref({
  email: '',
  password: '',
  password_confirmation: '',
  token: '',
})
const loading = ref(false)
const errorMessage = ref('')

// Determine if the reset link is invalid
const invalidLink = computed(() => !form.value.token || !form.value.email)

const validateConfirmPassword = (_rule: any, value: any) => {
  if (!value) return Promise.reject('Please confirm your password!')
  if (value !== form.value.password) return Promise.reject('Passwords do not match!')
  return Promise.resolve()
}

const onFinish = async (_values: any) => {
  if (invalidLink.value) return

  loading.value = true
  errorMessage.value = ''
  try {
    //
    await router.push('/auth/login')
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message || 'Invalid or expired token. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  form.value.token = (route.query.token as string) || ''
  form.value.email = (route.query.email as string) || ''

  if (invalidLink.value) {
    errorMessage.value =
      'Invalid reset link. Please check your email or request a new password reset.'
  }
})
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
<!--    <img class="h-10 mx-auto" :src="appStore.app.logo" alt="Company Logo" />-->

    <div class="text-center">
      <h1 class="text-xl font-bold tracking-tight text-gray-900">Reset Your Password</h1>
      <p class="mt-2 text-base text-gray-500" v-if="!invalidLink">
        Create a new, strong password for your account.
      </p>
    </div>

    <a-form
      v-if="!invalidLink"
      :model="form"
      layout="vertical"
      @finish="onFinish"
      class="space-y-6"
    >
      <a-alert v-if="errorMessage" :message="errorMessage" type="error" show-icon class="mb-4" />

      <a-form-item
        label="New Password"
        name="password"
        :rules="[
          { required: true, message: 'Please input your new password!' },
          { min: 8, message: 'Password must be at least 8 characters long.' },
        ]"
      >
        <a-input-password placeholder="••••••••" v-model:value="form.password" />
      </a-form-item>

      <a-form-item
        label="Confirm New Password"
        name="password_confirmation"
        :rules="[{ validator: validateConfirmPassword }]"
      >
        <a-input-password placeholder="••••••••" v-model:value="form.password_confirmation" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">
          Set New Password
        </a-button>
      </a-form-item>
    </a-form>

    <div v-else class="text-center p-6 bg-red-50 border border-red-200 rounded-lg">
      <h2 class="font-semibold text-red-800">Invalid Reset Link</h2>
      <p class="mt-2 text-sm text-red-700">
        This password reset link is invalid or expired. Please request a new password reset.
      </p>
      <router-link
        :to="{ name: 'auth.forgot-password' }"
        class="mt-4 inline-block text-blue-600 hover:underline"
      >
        Request a new password reset
      </router-link>
    </div>

    <div class="text-center">
      <router-link
        :to="{ name: 'auth.login' }"
        class="text-sm font-medium text-blue-600 hover:underline"
      >
        &larr; Back to Log In
      </router-link>
    </div>
  </div>
</template>
