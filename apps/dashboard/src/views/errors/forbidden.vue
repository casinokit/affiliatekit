<script setup lang="ts"></script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <a-result
      status="403"
      title="403"
      sub-title="Sorry, you are not authorized to access this page."
    >
      <template #extra>
        <RouterLink :to="{ name: 'auth.login' }">
          <a-button type="primary">Go to Home</a-button>
        </RouterLink>
      </template>
    </a-result>
  </div>
</template>
