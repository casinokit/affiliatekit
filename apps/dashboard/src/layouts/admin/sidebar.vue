<script setup lang="ts">
import { ref } from 'vue'
import NavItem from '@/layouts/shared/nav-item/index.vue'
import {
  LayoutDashboard,
  Settings,
  ChartSpline,
  Megaphone,
  Share2,
  LogOut,
  Shield,
  CreditCard,
  UserCog,
  Unplug,
  Inbox,
  Handshake,
} from '@lucide/vue'
import { useAuth } from '@/composables/use-auth'
import { useRoute } from 'vue-router'
import type { NavigationItem } from '@/types/navigation'

/* ---------- Props/emit ---------- */
const props = defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits<{ (e: 'update:isOpen', val: boolean): void }>()
const updateIsOpen = (val: boolean) => emit('update:isOpen', val)

/* ---------- Menu data ---------- */
const menuItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    routeName: 'admin.dashboard',
  },

  {
    label: 'Offers',
    icon: Share2,
    submenu: [
      // {
      //   routeName: "#",
      //   label: 'Add',
      // },
    ],
  },
  {
    label: 'Settings',
    icon: Settings,
    routeName: 'admin.settings.general',
  },
  {
    label: 'Logout',
    icon: LogOut,
    action: 'logout',
  },
]

/* ---------- State ---------- */

// 2. GET THE CURRENT ROUTE
const route = useRoute() //

const { logout } = useAuth()

// 3. CREATE A FUNCTION TO FIND THE ACTIVE PARENT
const findActiveSubmenuParent = () => {
  const parent = menuItems.find((item) =>
    item.submenu?.some((subItem) => subItem.routeName === route.name)
  )
  return parent ? parent.label : undefined
}

// 4. INITIALIZE openSubmenu BY CALLING THE FUNCTION
const openSubmenu = ref<string | undefined>(findActiveSubmenuParent()) // <-- MODIFY THIS LINE

const handleSubmenuToggle = (label: string) => {
  openSubmenu.value = openSubmenu.value === label ? undefined : label
}
const closeAllSubmenus = () => (openSubmenu.value = undefined)

const handleAction = async (actionName: string) => {
  if (actionName === 'logout') {
    await logout()
  }
}
</script>

<template>
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
    :class="{ hidden: !isOpen }"
    @click="updateIsOpen(false)"
  />

  <!-- Sidebar -->
  <div
    class="fixed inset-y-0 left-0 z-30 w-56 overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0 no-scrollbar shadow-md"
    :class="isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'"
  >
    <!-- Brand -->
    <div class="flex items-center justify-center mt-8">
      <!--      <img :src="appStore.app.logo" alt="logo" class="!w-40" />-->
    </div>

    <!-- Navigation -->
    <nav class="mt-10">
      <NavItem
        v-for="item in menuItems"
        :key="item.label"
        v-bind="item"
        :open-submenu="openSubmenu"
        @toggle="handleSubmenuToggle"
        @close-all="closeAllSubmenus"
        @action="handleAction"
      />
    </nav>
  </div>
</template>
