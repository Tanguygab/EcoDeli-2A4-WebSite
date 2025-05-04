<script setup lang="ts">
import axios from 'axios';
import { startSession } from '@/stores/session';
import router from '@/router';

const session = startSession();

function logout() {
    axios.post("http://localhost:3000/auth/logout", {}, session.getHeaders);
    session.set("", null);
    router.push("/");
}
</script>

<template>
    <a @click="logout">Logout</a>
</template>