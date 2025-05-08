<script setup lang="ts">
import { startSession } from "@/stores/session"
import { api, logout } from "@/api";
import Logo from "../Logo.vue";

const session = startSession()
api(session)

</script>

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <Logo link="/" />
        </div>
        <div class="navbar-menu navbar-end navbar-item buttons">
            <div v-if="session.session.token || true">
                <div class="navbar-item has-dropdown is-hoverable">
                    <img src="@/assets/pedro.png">
                    <div class="navbar-dropdown is-boxed is-right">
                        <RouterLink class="navbar-item" to="profile">{{ $t("user.profile") }}</RouterLink>
                        <RouterLink class="navbar-item" to="notifications">{{ $t("user.notifications") }}</RouterLink>
                        <RouterLink class="navbar-item" to="settings">{{ $t("user.settings") }}</RouterLink>
                        <hr class="navbar-divider">
                        <a @click="logout()" class="navbar-item">{{ $t("auth.logout") }}</a>
                    </div>
                </div>
            </div>
            <RouterLink v-else to="login" class="button is-light">{{ $t("auth.login") }}</RouterLink>
        </div>
    </nav>
</template>