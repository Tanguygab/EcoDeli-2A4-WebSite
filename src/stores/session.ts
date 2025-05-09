import { defineStore } from 'pinia'
import { StorageSerializers, useLocalStorage } from '@vueuse/core'
import type { User } from '@/types/user'

export const startSession = defineStore('session', {
  state: () => ({
    token: useLocalStorage('token', ""),
    user: useLocalStorage<User | null>('user', null, { serializer: StorageSerializers.object }),
  }),
  getters: {
    getHeader: (state) => ({ Authorization: "Bearer " + state.token })
  },
  actions: {
    saveToken(token: string, user?: User) {
      this.token = token;
      this.user = user ?? null;
    },
  },
})

export type Session = ReturnType<typeof startSession>

