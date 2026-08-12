<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

import type { PropType } from 'vue'
import type { NavigationSubItem } from '@/types'

const props = defineProps({
  routeName: { type: String, default: '' },
  params: { type: Object as PropType<Record<string, string>>, default: null },
  query: { type: Object as PropType<Record<string, string>>, default: null },
  icon: { type: [Object, Function], required: true },
  label: { type: String, required: true },
  submenu: { type: Array as PropType<NavigationSubItem[]>, default: null },
  openSubmenu: { type: String, default: null },
  action: { type: String, default: null },
})

const emit = defineEmits(['close-all', 'toggle', 'action'])


const route = useRoute()
const Icon = props.icon


const isActive = computed(() => {
  if (props.action) {
    return false
  }

  if (props.routeName && route.name === props.routeName) {
    return true
  }

  if (props.submenu) {
    const specificMatch = props.submenu.some((item) => isSubItemActive(item))
    if (specificMatch) {
      return true
    }

    const firstSubmenuRoute = props.submenu[0]?.routeName
    if (firstSubmenuRoute) {
      const prefix = firstSubmenuRoute.split('.').slice(0, 2).join('.')
      return (route.name as string)?.startsWith(prefix + '.')
    }
  }

  return false
})

const isSubmenuOpen = computed(() => props.openSubmenu === props.label)

const isSubItemActive = (item: NavigationSubItem) => {
  if (route.name !== item.routeName) {
    return false
  }


  if (item.params) {
    const paramsMatch = Object.keys(item.params).every((key) => {
      return route.params[key] === item.params![key]
    })
    if (!paramsMatch) {
      return false
    }
  }

  if (item.query) {
    return Object.keys(item.query).every((key) => {
      const routeValue = route.query[key]
      const itemValue = item.query![key]
      if (Array.isArray(routeValue)) {
        return routeValue.length === 1 && routeValue[0] === itemValue
      }
      return routeValue === itemValue
    })
  }

  if (!item.query && props.submenu) {
      const siblingWithQueryActive = props.submenu.some((sibling: NavigationSubItem) => {
      if (sibling === item || sibling.routeName !== item.routeName || !sibling.query) {
        return false
      }
      return Object.keys(sibling.query).every((key) => {
        const routeValue = route.query[key]
        const siblingValue = sibling.query![key]
        if (Array.isArray(routeValue)) {
          return routeValue.length === 1 && routeValue[0] === siblingValue
        }
        return routeValue === siblingValue
      })
    })
    if (siblingWithQueryActive) {
      return false
    }
  }
  return true
}

const baseClasses =
  'flex items-center px-4 py-2.5 mx-2 my-1 rounded-md transition-colors duration-200 cursor-pointer'
const activeClass = 'bg-blue-50 text-blue-600 font-semibold '
const inactiveClass = 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'

const subItemActiveClass = 'text-blue-600 font-medium '
const subItemInactiveClass = 'text-gray-500 hover:text-gray-900 d'
</script>

<template>
  <div>
    <RouterLink
      v-if="!submenu && routeName"
      :to="{ name: routeName, params: params, query: query }"
      @click="$emit('close-all')"
      :class="[baseClasses, isActive ? activeClass : inactiveClass]"
    >
      <component :is="Icon" class="w-5 h-5" />
      <span class="mx-3 text-sm font-medium">{{ label }}</span>
    </RouterLink>

    <div v-else-if="action" @click="emit('action', action)" :class="[baseClasses, inactiveClass]">
      <component :is="Icon" class="w-5 h-5" />
      <span class="mx-3 text-sm font-medium">{{ label }}</span>
    </div>

    <div
      v-else
      @click="$emit('toggle', label)"
      :class="[baseClasses, isActive ? activeClass : inactiveClass]"
    >
      <component :is="Icon" class="w-5 h-5" />
      <span class="mx-3 text-sm font-medium">{{ label }}</span>
      <span class="ml-auto">
        <svg
          :class="['w-4 h-4 transition-transform duration-300', { 'rotate-90': isSubmenuOpen }]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </span>
    </div>

    <div
      v-if="submenu"
      class="overflow-hidden transition-all duration-300 ease-in-out"
      :class="isSubmenuOpen ? 'max-h-96' : 'max-h-0'"
    >
      <div class="py-2 pl-6 ml-4 border-l border-gray-200 dark:border-gray-700">
        <RouterLink
          v-for="item in submenu"
          :key="item.routeName"
          :to="{ name: item.routeName, params: item.params, query: item.query }"
          class="flex items-center px-4 py-2 my-0.5 rounded-md transition-colors duration-200"
          :class="isSubItemActive(item) ? subItemActiveClass : subItemInactiveClass"
        >
          <span class="text-sm">{{ item.label }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
