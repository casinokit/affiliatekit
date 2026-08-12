import type { Component } from 'vue'

export type NavigationSubItem = {
  label: string
  routeName: string
  params?: Record<string, string>
  query?: Record<string, string>
}

export type NavigationItem = {
  label: string
  icon: Component
  routeName?: string
  action?: string
  submenu?: NavigationSubItem[]
}
