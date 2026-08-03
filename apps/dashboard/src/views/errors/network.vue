<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WifiOff } from '@lucide/vue'

const router = useRouter()

const retryConnection = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <a-result
      title="Connection Lost"
      sub-title="We couldn't connect to our servers. Please check your internet connection or try again."
    >
      <template #icon>
        <div class="flex justify-center text-red-500 mb-4">
          <WifiOff :size="72" stroke-width="1.5" />
        </div>
      </template>
      <template #extra>
        <a-button type="primary" @click="retryConnection">
          Try Again
        </a-button>
      </template>
    </a-result>
  </div>
</template>
