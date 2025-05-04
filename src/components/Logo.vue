<script setup lang="ts">
defineProps < { link: string, initials?: boolean } > ()

</script>

<template>
    <RouterLink :to="link" class="navbar-item">
        <img v-if="initials" src="@/assets/logo/initials.png" alt="ED Logo">
        <img v-else src="@/assets/logo/normal.png" alt="ED Logo">
    </RouterLink>
</template>