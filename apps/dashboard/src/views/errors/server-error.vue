<script setup lang="ts"></script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <a-result
      status="500"
      title="500"
      sub-title="Sorry, something went wrong on our server."
    >
      <template #extra>
        <RouterLink :to="{ name: 'auth.login' }">
          <a-button type="primary">Go to Home</a-button>
        </RouterLink>
      </template>
    </a-result>
  </div>
</template>
