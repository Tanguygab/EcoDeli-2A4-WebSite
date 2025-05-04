<script setup lang="ts">
import { startSession } from "@/stores/session"
import Logo from "../Logo.vue";

const session = startSession()

</script>

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <Logo link="/" />
        </div>
        <div class="navbar-menu navbar-end navbar-item buttons">
            <div v-if="session.session.token">
                <!-- profile icon -->
            </div>
            <RouterLink v-else to="login" class="button is-light">{{ $t("auth.login") }}</RouterLink>
        </div>
    </nav>
</template>