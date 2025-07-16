<template>
  <div v-if="isAdmin">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { startSession } from '@/stores/session'

const session = startSession()

const isAdmin = computed(() => {
  return session.user && session.user.role.access_level === 0
})
</script>
