<script setup lang="ts">
import { Home } from '@lucide/vue';
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
    <p class="text-gray-600 mb-4">Welcome to your affiliate dashboard.</p>
    <a-button type="primary" class="flex items-center gap-2">
      <Home class="w-4 h-4" />
      Home Button
    </a-button>
  </div>
</template>
