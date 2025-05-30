<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import router from '@/router'
</script>

<template>
    <footer class="footer has-background-transparent">
        <div class="content has-text-centered">
            <p>
                © 2025 EcoDeli. Tous droits réservés.
            </p>
            <RouterLink to="/contact" class="button is-primary">Contactez-nous</RouterLink>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    padding: 2rem 1.5rem 2rem 1.5rem;
}
</style>
