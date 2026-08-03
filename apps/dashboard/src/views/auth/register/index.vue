<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const loading = ref(false)
const errorMessage = ref('')

const validateConfirmPassword = (_rule: any, value: any) => {
  if (!value) return Promise.reject('Please confirm your password!')
  if (value !== form.value.password) return Promise.reject('Passwords do not match!')
  return Promise.resolve()
}

const onFinish = async (_values: any) => {
  loading.value = true
  errorMessage.value = ''
  try {
    //
  } catch (error: any) {
    errorMessage.value = error?.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
    <div class="text-center">
      <h1 class="text-xl font-bold tracking-tight text-gray-900">Create an Account</h1>
      <p class="mt-2 text-base text-gray-500">Register to get started</p>
    </div>

    <a-alert v-if="errorMessage" :message="errorMessage" type="error" show-icon class="mb-4" />

    <a-form :model="form" layout="vertical" @finish="onFinish" class="space-y-6">
      <a-form-item
        label="Full Name"
        name="fullName"
        :rules="[{ required: true, message: 'Please input your full name!' }]"
      >
        <a-input placeholder="John Doe" v-model:value="form.fullName" />
      </a-form-item>

      <a-form-item
        label="Email"
        name="email"
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
