<script setup lang="ts">
import { startSession } from "@/stores/session"
import { api, logout } from "@/api";
import Logo from "../Logo.vue";
import { ref } from "vue";

const session = startSession()
api(session)

const menuIcon = ref()
const menu = ref(false)

function openMenu() {
    menu.value = true
}

document.addEventListener("click", e => {
    if (e.target !== menuIcon.value) {
        menu.value = false
    }
})

</script>

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <Logo link="/" />
        </div>
        <div class="navbar-menu navbar-end navbar-item buttons">
            <div v-if="session.user">
                <div :class="'navbar-item has-dropdown is-hoverable' + (menu ? ' is-active' : '')" @click="openMenu">
                    <img ref="menuIcon" alt="Profile Picture" src="@/assets/pedro.png">
                    <div class="navbar-dropdown is-boxed is-right">
                        <RouterLink class="navbar-item" to="/profile">{{ $t("user.profile") }}</RouterLink>
                        <RouterLink class="navbar-item" to="/notifications">{{ $t("user.notifications") }}</RouterLink>
                        <RouterLink class="navbar-item" to="/my-files">{{ $t("user.my-files") }}</RouterLink>
                        <RouterLink class="navbar-item" to="/my-products">{{ $t("user.my-products") }}</RouterLink>
                        <RouterLink class="navbar-item" to="/settings">{{ $t("user.settings") }}</RouterLink>
                        <RouterLink class="navbar-item" to="/livreur/form">
                            Demande livreur
                        </RouterLink>
                        <hr class="navbar-divider">
                        <RouterLink v-if="session.user.role.access_level >= 100" class="navbar-item has-text-danger-50"
                            to="/backoffice">
                            {{ $t("user.backoffice") }}
                        </RouterLink>
                        <a @click="logout()" class="navbar-item">{{ $t("auth.logout") }}</a>
                    </div>
                </div>
            </div>
            <RouterLink v-else to="login" class="button is-light">{{ $t("auth.login") }}</RouterLink>
        </div>
    </nav>
</template>
