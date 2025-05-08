<script setup lang="ts">
import { RouterView } from 'vue-router'
import FrontOffice from "./components/nav/FrontOffice.vue"
import router from './router';
import BackOffice from './components/nav/BackOffice.vue';
</script>

<template>
  <header class="header">
    <BackOffice v-if="router.currentRoute.value?.path.startsWith('/backoffice')" />
    <FrontOffice v-else />
  </header>
  <main>
    <div class="container is-flex is-flex-direction-column is-align-items-center mt-5">
      <RouterView />
    </div>
  </main>
  <footer class="footer mt-auto">
    footer
  </footer>
</template>

<style scoped>
.container {
  width: 75%;
}
</style>