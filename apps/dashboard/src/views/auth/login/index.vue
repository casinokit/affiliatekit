<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../../composables/use-auth'

const { login, loading, errorMsg, validationErrors } = useAuth()

const form = ref({
  email: '',
  password: '',
  remember: false,
})

const onFinish = async (values: any) => {
  try {
    // Delegate entirely to our new composable
    await login(values)
  } catch (err) {
    // Handled internally by the composable, no extra UI logic needed here
  }
}
</script>

<template>
  <div class="w-full max-w-sm space-y-6">
    <!--    <img class="h-10 mx-auto" :src="appStore.logo" alt="Company Logo" />-->
    <div class="text-center">
      <h1 class="text-xl font-bold tracking-tight text-gray-900">Welcome Back</h1>
      <p class="mt-2 text-base text-gray-500">Log in to your account</p>
    </div>

    <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon />

    <a-form :model="form" layout="vertical" @finish="onFinish" class="space-y-6">
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
          { min: 5, message: 'Password must be at least 5 characters long.' },
        ]"
      >
        <a-input-password placeholder="••••••••" v-model:value="form.password" />
      </a-form-item>

      <a-form-item>
        <div class="flex items-center justify-between">
          <a-form-item name="remember" valuePropName="checked" no-style>
            <a-checkbox v-model:checked="form.remember">Remember me</a-checkbox>
          </a-form-item>
          <router-link
            to="/auth/forgot-password"
            class="text-sm font-medium text-blue-600 hover:underline"
          >
            Forgot password?
          </router-link>
        </div>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" block :loading="loading"> Log In </a-button>
      </a-form-item>
    </a-form>

    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="bg-white px-2 text-gray-500">OR</span>
      </div>
    </div>

    <div class="text-center mt-6">
      <p class="text-sm text-gray-500 mb-3">New to our platform?</p>
      <div class="flex justify-center gap-3">
        <router-link :to="{ name: 'auth.register' }">
          <a-button class="border-indigo-500! hover:bg-indigo-500! hover:text-white!">
            Create an account
          </a-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
