<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../../../composables/use-auth'

const route = useRoute()
const { resetPassword, loading, errorMsg } = useAuth()

const form = ref({
  email: '',
  password: '',
  password_confirmation: '',
  token: '',
})

// Determine if the reset link is invalid
const invalidLink = computed(() => !form.value.token || !form.value.email)

const validateConfirmPassword = (_rule: any, value: any) => {
  if (!value) return Promise.reject('Please confirm your password!')
  if (value !== form.value.password) return Promise.reject('Passwords do not match!')
  return Promise.resolve()
}

const onFinish = async (values: any) => {
  if (invalidLink.value) return
  
  // Note: antd passes only the form fields, so we need to inject the token/email from route query manually if they aren't in the template
  const payload = {
    ...values,
    email: form.value.email,
    token: form.value.token,
  }

  try {
    await resetPassword(payload)
  } catch (err) {
    // Handled natively by composable
  }
}

onMounted(() => {
  form.value.token = (route.query.token as string) || ''
  form.value.email = (route.query.email as string) || ''

  if (invalidLink.value) {
    errorMsg.value =
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
      <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon class="mb-4" />

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
