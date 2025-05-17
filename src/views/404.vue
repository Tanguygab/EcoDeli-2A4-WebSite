<script setup lang="ts">
import router from '@/router'

let state = router.options.history.state
</script>

<template>
    <img class="is-halfheight" src="@/assets/404.png" alt="Page not found" />
    <div class="is-flex mt-3">
        <RouterLink class="button is-primary" to="/">{{ $t("404.home") }}</RouterLink>
        <RouterLink class="button is-info" v-if="state.back" :to="state.back as string">{{ $t("404.back") }}</RouterLink>
    </div>
</template>

<style scoped>
.is-halfheight {
    height: 50vh;
}
.is-flex {
    gap: 1em
}
</style>
