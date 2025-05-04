<script setup lang="ts">
defineProps<{icon: string}>()
</script>

<template>
    <span class="icon">
        <i :class="'fas ' + icon"></i>
    </span>
</template>