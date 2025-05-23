<script setup lang="ts">
defineProps<{ file: string }>()
</script>

<template>
    <button class="button is-justify-content-start">
        {{ file }}
    </button>
</template>

<style>
</style>
