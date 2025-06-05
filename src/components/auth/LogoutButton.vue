<script setup lang="ts">
import { startSession } from '@/stores/session';
import { api, logout } from '@/api.ts'

api(startSession())
</script>

<template>
    <a @click="logout">Logout</a>
</template>
