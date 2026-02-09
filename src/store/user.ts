import { defineStore } from 'pinia'

type UserPayload = {
  username: string
  role: string | null
  memberId?: string | number | null
}

export const useUserStore = defineStore('user', {
  state: () => ({
    initialized: false,
    isLogin: false,
    username: null as string | null,
    role: null as string | null,
    memberId: null as string | number | null,
  }),
  actions: {
    async hydrateFromSession() {
      if (this.initialized) return
      this.initialized = true

      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' })
        if (!response.ok) {
          this.clearUser()
          return
        }

        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          this.clearUser()
          return
        }

        const data = await response.json()
        this.setUser({
          username: data.username,
          role: data.role,
          memberId: data.memberId ?? data.id ?? null,
        })
      } catch {

        this.clearUser()
      }
    },
    setUser(payload: UserPayload) {
      this.username = payload.username
      this.role = payload.role
      this.memberId = payload.memberId ?? null
      this.isLogin = true
    },
    clearUser() {
      this.username = null
      this.role = null
      this.memberId = null
      this.isLogin = false
    },
  },
})
