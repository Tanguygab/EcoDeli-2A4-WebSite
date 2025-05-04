import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const startSession = defineStore('session', () => {
  const session = {
    token: useLocalStorage('token', ""),
    username: useLocalStorage('username', ""),
  }
  
  function getHeader() {
    return { Authorization: "Bearer " + this.token }
  }
  
  function saveToken(token: string, username: string) {
    this.token = token;
    this.username = username;
  }
  
  return { session, getHeader, saveToken }
})
