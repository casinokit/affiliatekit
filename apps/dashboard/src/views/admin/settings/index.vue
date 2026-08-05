<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, provide } from 'vue'

import {
  FileText,
  Building2,
  Globe,
  Mail,
  Handshake,
  FileSignature,
  CreditCard,
  Coins,
  Megaphone,
  Receipt,
  ArrowLeftRight,
  MailCheck,
  Columns3Cog,
  Gift,
} from '@lucide/vue'

const route = useRoute()
const router = useRouter()

const tabs = [
  { key: 'general', label: 'General', icon: Building2, route: 'admin.settings.general' },
  { key: 'registration', label: 'Registration', icon: FileSignature, route: 'admin.settings.registration' },
]

const activeKey = computed({
  get: () => {
    const current = tabs.find((tab) => route.name === tab.route)
    return current ? current.key : 'general'
  },
  set: (key) => {
    const tab = tabs.find((tab) => tab.key === key)
    if (!tab) return
    router.push({ name: tab.route, params: route.params })
  },
})

const currentTabLabel = computed(() => {
  const tab = tabs.find((t) => t.key === activeKey.value)
  return tab ? tab.label : 'General'
})
</script>

<template>
  <!-- Breadcrumb -->
  <a-breadcrumb class="!mb-4" separator=">">
    <a-breadcrumb-item>Admin</a-breadcrumb-item>
    <a-breadcrumb-item>Settings</a-breadcrumb-item>
    <a-breadcrumb-item>{{ currentTabLabel }}</a-breadcrumb-item>
  </a-breadcrumb>

  <!-- Card with Tabs -->
  <a-card :bordered="false" class="shadow-sm">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane v-for="tab in tabs" :key="tab.key">
        <template #tab>
          <span class="flex items-center gap-2">
            <component :is="tab.icon" :size="16" />
            <span>{{ tab.label }}</span>
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
    <router-view />
  </a-card>
</template>
