<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, Search, Bell, User, LogOut } from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/use-auth'

const { logout } = useAuth()
const authStore = useAuthStore()

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (e: 'update:isOpen', val: boolean): void }>()
const updateIsOpen = (val: boolean) => emit('update:isOpen', val)

const dropdownOpen = ref(false)

// Computed for safe access
const user = computed(
  () => authStore.user || { fullName: '', full_name: '', email: '', avatar: '' }
)
const userInitials = computed(() => {
  const name = authStore.user?.fullName || (authStore.user as any)?.full_name || ''
  const parts = name.trim().split(' ')
  if (!parts[0]) return ''
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

const handleLogout = async () => {
  await logout()
}
</script>

<template>
  <header
    class="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b border-gray-200"
  >
    <!-- Left: Menu & Search -->
    <div class="flex items-center">
      <button
        class="text-gray-500 hover:text-gray-900 focus:outline-none lg:hidden"
        @click="updateIsOpen(true)"
      >
        <Menu class="w-6 h-6" />
      </button>

      <div class="relative ml-4 lg:ml-0">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search class="w-5 h-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search"
          class="w-48 py-2 pl-10 pr-4 bg-gray-100 rounded-lg sm:w-64 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
    </div>

    <!-- Right: Notifications & Profile -->
    <div class="flex items-center space-x-4">
<!--      <button class="relative text-gray-500 hover:text-gray-900 focus:outline-none">-->
<!--        <span class="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>-->
<!--        <Bell class="w-6 h-6" />-->
<!--      </button>-->

      <div class="relative">
        <button
          class="w-10 h-10 overflow-hidden rounded-full shadow focus:outline-none ring-2 ring-transparent"
          @click="dropdownOpen = !dropdownOpen"
        >
          <template v-if="user.avatar">
            <img class="object-cover w-full h-full" :src="user.avatar" alt="avatar" />
          </template>
          <template v-else>
            <div class="flex items-center justify-center w-full h-full rounded-full bg-gray-300">
              {{ userInitials }}
            </div>
          </template>
        </button>

        <!-- Dropdown -->
        <transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="dropdownOpen"
            class="absolute right-0 z-20 w-56 py-2 mt-2 bg-white rounded-md shadow-lg ring-1 ring-gray-300 ring-opacity-5"
          >
            <!-- User Info -->
            <div class="px-4 py-2">
              <p class="text-sm font-medium text-gray-800">
                {{ user.fullName || (user as any).full_name }}
              </p>
              <p class="text-xs text-gray-500">{{ user.email }}</p>
            </div>
            <hr class="border-gray-200" />

            <!-- Profile -->
            <RouterLink
              :to="{ name: 'admin.profile' }"
              class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="dropdownOpen = false"
            >
              <User class="w-4 h-4 mr-3" />
              <span>Profile</span>
            </RouterLink>

            <hr class="border-gray-200" />

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut class="w-4 h-4 mr-3" />
              <span>Log out</span>
            </button>
          </div>
        </transition>

        <!-- Overlay to close dropdown when clicking outside -->
        <div v-if="dropdownOpen" class="fixed inset-0 z-10" @click="dropdownOpen = false"></div>
      </div>
    </div>
  </header>
</template>
