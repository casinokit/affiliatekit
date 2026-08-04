<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from '@/layouts/affiliate/sidebar.vue'
import Header from '@/layouts/affiliate/header.vue'

const isOpen = ref(false)
</script>
<template>
  <div class="flex h-screen bg-gray-200 font-roboto">
    <Sidebar v-model:isOpen="isOpen" />

    <div class="flex-1 flex flex-col overflow-hidden">
      <Header v-model:isOpen="isOpen" />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div class="mx-auto px-6 py-8">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
