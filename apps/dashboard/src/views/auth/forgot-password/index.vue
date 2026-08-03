<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../../composables/use-auth'

const { forgotPassword, loading, errorMsg } = useAuth()

const form = ref({ email: '' })
const emailSent = ref(false)

const onFinish = async (values: any) => {
  try {
    await forgotPassword(values)
    emailSent.value = true
  } catch (error) {
    // Error is handled and surfaced by errorMsg
    emailSent.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
<!--    <img class="h-10 mx-auto" :src="appStore.app.logo" alt="Company Logo" />-->
    <div class="text-center">
      <h1 class="text-xl font-bold tracking-tight text-gray-900">Forgot Password?</h1>
      <p v-if="!emailSent" class="mt-2 text-base text-gray-500">
        Enter your email and we'll send you a link to reset your password.
      </p>
    </div>

    <div v-if="emailSent" class="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
      <h2 class="font-semibold text-green-800">Check your inbox</h2>
      <p class="mt-1 text-sm text-green-700">
        A password reset link has been sent to <span class="font-bold">{{ form.email }}</span
        >.
      </p>
    </div>

    <a-form v-else :model="form" layout="vertical" @finish="onFinish" class="space-y-6">
      <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon class="mb-4" />
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

      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading">
          Send Reset Link
        </a-button>
      </a-form-item>
    </a-form>

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
