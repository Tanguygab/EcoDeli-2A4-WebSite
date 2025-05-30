<script setup lang="ts">
import { RouterView } from 'vue-router'
import FrontOffice from "./components/nav/FrontOffice.vue"
import router from './router';
import BackOffice from './components/nav/BackOffice.vue';
import footercomponent from './components/nav/footercomponent.vue';

function path() {
    return router.currentRoute.value?.path
}
</script>

<template>
  <header class="header">
    <BackOffice v-if="path()?.startsWith('/backoffice')" />
    <FrontOffice v-else />
  </header>
  <main :class="(path()?.startsWith('/products') ? '' : 'container ') + 'is-flex is-flex-direction-column is-align-items-center my-5'">
      <RouterView />
  </main>
  <footer class="footer mt-auto">
    <footercomponent />
  </footer>
</template>

<style scoped>
.container {
    width: 75%;
}
</style>
