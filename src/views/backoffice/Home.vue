<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { startSession } from '@/stores/session'

const router = useRouter()
const session = startSession()

// Vérification de sécurité pour toutes les pages du back office
onMounted(() => {
  if (!session.user || session.user.role.access_level !== 0) {
    alert('Accès refusé : vous devez être administrateur pour accéder au back office.')
    router.push('/')
  }
})
</script>

<template>
    <RouterView />
</template>
