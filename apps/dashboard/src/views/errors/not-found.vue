<script setup lang="ts"></script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <a-result
      status="404"
      title="404"
      sub-title="Sorry, we couldn’t find the page you’re looking for."
    >
      <template #extra>
        <RouterLink :to="{ name: 'auth.login' }">
          <a-button type="primary">Go to Home</a-button>
        </RouterLink>
      </template>
    </a-result>
  </div>
</template>
