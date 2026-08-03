<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../../composables/use-auth'

const { register, loading, errorMsg, validationErrors } = useAuth()
const isSuccess = ref(false)

const form = ref({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const validateConfirmPassword = (_rule: any, value: any) => {
  if (!value) return Promise.reject('Please confirm your password!')
  if (value !== form.value.password) return Promise.reject('Passwords do not match!')
  return Promise.resolve()
}

const onFinish = async (values: any) => {
  try {
    const success = await register(values)
    if (success) {
      isSuccess.value = true
    }
  } catch (err) {
    // Handled internally by the composable
  }
}
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
    <div class="text-center">
      <h1 class="text-xl font-bold tracking-tight text-gray-900">Create an Account</h1>
      <p class="mt-2 text-base text-gray-500">Register to get started</p>
    </div>

    <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon class="mb-4" />

    <div v-if="isSuccess" class="text-center p-6 bg-green-50 rounded-lg">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
        <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Registration Successful!</h3>
      <p class="text-sm text-gray-500 mb-6">Your account has been created successfully. You will receive an email shortly once your account is activated by an administrator.</p>
      <router-link :to="{ name: 'auth.login' }">
        <a-button type="primary">Return to Login</a-button>
      </router-link>
    </div>

    <a-form v-else :model="form" layout="vertical" @finish="onFinish" class="space-y-6">
      <a-form-item
        label="Full Name"
        name="fullName"
        :validateStatus="validationErrors.fullName ? 'error' : ''"
        :help="validationErrors.fullName"
        :rules="[{ required: true, message: 'Please input your full name!' }]"
      >
        <a-input placeholder="John Doe" v-model:value="form.fullName" />
      </a-form-item>

      <a-form-item
        label="Email"
        name="email"
        :validateStatus="validationErrors.email ? 'error' : ''"
        :help="validationErrors.email"
        :rules="[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Invalid email address.' },
        ]"
      >
        <a-input placeholder="name@example.com" v-model:value="form.email" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :validateStatus="validationErrors.password ? 'error' : ''"
        :help="validationErrors.password"
        :rules="[
          { required: true, message: 'Please input your password!' },
          { min: 8, message: 'Password must be at least 8 characters long.' },
        ]"
      >
        <a-input-password placeholder="••••••••" v-model:value="form.password" />
      </a-form-item>

      <a-form-item
        label="Confirm Password"
        name="passwordConfirmation"
        :validateStatus="validationErrors.passwordConfirmation ? 'error' : ''"
        :help="validationErrors.passwordConfirmation"
        :rules="[{ validator: validateConfirmPassword }]"
      >
        <a-input-password placeholder="••••••••" v-model:value="form.passwordConfirmation" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">
          Create Account
        </a-button>
      </a-form-item>
    </a-form>

    <div class="text-center mt-6">
      <p class="text-sm text-gray-500 mb-3">Already have an account?</p>
      <div class="flex justify-center gap-3">
        <router-link :to="{ name: 'auth.login' }">
          <a-button class="border-indigo-500! hover:bg-indigo-500! hover:text-white!">
            Log In
          </a-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
