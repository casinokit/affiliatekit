import { createTuyau } from '@tuyau/core/client'
import { registry } from '@affiliatekit/core/registry'
import type { useAuthStore } from '../stores/auth'
import type { Router } from 'vue-router'

// ─────────────────────────────────────────────────────────────
// STEP 1: Cache the auth store and router after loading them once.
// `import(...)` is async and a little slow, so we only want to pay
// that cost the FIRST time. After that, we just reuse what we got.
//
// Types: `ReturnType<typeof useAuthStore>` means "whatever type
// useAuthStore() returns." The `| null` covers the state before
// we've loaded it yet.
// ─────────────────────────────────────────────────────────────
let cachedAuthStore: ReturnType<typeof useAuthStore> | null = null
let cachedRouter: Router | null = null

async function getAuthStore() {
  if (cachedAuthStore === null) {
    const authModule = await import('../stores/auth')
    cachedAuthStore = authModule.useAuthStore()
  }
  return cachedAuthStore
}

async function getRouter() {
  if (cachedRouter === null) {
    const routerModule = await import('../router')
    cachedRouter = routerModule.default
  }
  return cachedRouter
}

// ─────────────────────────────────────────────────────────────
// STEP 2: A custom header a request can attach to say "if this
// fails, don't redirect the whole app anywhere." Useful for
// background requests (polling, etc.) where a failure shouldn't
// kick the user out of what they're doing.
// ─────────────────────────────────────────────────────────────
const SILENT_ERRORS_HEADER = 'X-Silent-Errors'

export const api = createTuyau({
  registry,

  // If VITE_API_URL is set, use it. Otherwise use the current
  // website address (good for local dev and same-domain setups).
  baseUrl:
    import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : ''),

  // This function runs for EVERY API request made through `api`.
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    // ── 2a. Get the current auth store and the user's token ──
    const authStore = await getAuthStore()
    const token = authStore.token

    if (!init) {
      init = {}
    }

    // ── 2b. Figure out what headers already exist ──
    // Headers might already be set on `init.headers`, OR if `input`
    // is a `Request` object, they might live on `input.headers`.
    // We check both so we don't accidentally lose any headers.
    let existingHeaders: HeadersInit
    if (init.headers) {
      existingHeaders = init.headers
    } else if (input instanceof Request) {
      existingHeaders = input.headers
    } else {
      existingHeaders = {}
    }

    const headers = new Headers(existingHeaders)

    // ── 2c. Attach the auth token, if we have one ──
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    // ── 2d. Check if this request wants to skip error redirects ──
    const shouldStaySilentOnError = headers.get(SILENT_ERRORS_HEADER) === 'true'
    // Remove it before sending — the server doesn't need to see this.
    headers.delete(SILENT_ERRORS_HEADER)

    init.headers = headers

    // ── 2e. Actually make the request ──
    // Wrapped in try/catch because `fetch()` can THROW (not just
    // return an error status) if there's no internet, a DNS
    // problem, or a CORS issue.
    let response: Response
    try {
      response = await fetch(input, init)
    } catch (networkError) {
      if (!shouldStaySilentOnError) {
        const router = await getRouter()
        await router.push({ name: 'errors.network' })
      }
      const message = networkError instanceof Error ? networkError.message : String(networkError)
      throw new Error(`Network error: ${message}`, { cause: networkError })
    }

    // If this request opted out of redirects, just return the
    // response as-is — don't check the status code at all.
    if (shouldStaySilentOnError) {
      return response
    }

    // ── 2f. Handle specific error status codes ──
    if (response.status === 401) {
      // 401 = "you're not logged in" or "your session expired"
      authStore.token = null
      const router = await getRouter()
      const navResult = await router.push({
        name: 'auth.login',
        query: { redirect: window.location.pathname },
      })
      if (navResult) {
        console.warn('Could not navigate to login page:', navResult)
      }
    } else if (response.status === 403) {
      // 403 = "you're logged in, but not allowed to do this"
      const router = await getRouter()
      const navResult = await router.push({ name: 'errors.forbidden' })
      if (navResult) {
        console.warn('Could not navigate to forbidden page:', navResult)
      }
    } else if (response.status >= 500) {
      // 500+ = something broke on the server's side
      const router = await getRouter()
      const navResult = await router.push({ name: 'errors.server-error' })
      if (navResult) {
        console.warn('Could not navigate to server-error page:', navResult)
      }
    }

    return response
  },
})
