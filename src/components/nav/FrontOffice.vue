<script setup lang="ts">
import { startSession } from "@/stores/session"
import { api, logout } from "@/api";
import Logo from "../Logo.vue";
import { ref } from "vue";
import i18next from "i18next"

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

// Langue
const langMenu = ref(false)
const currentLang = ref(i18next.language || "fr")
function openLangMenu() {
    langMenu.value = !langMenu.value
}
function setLang(lang: string) {
    i18next.changeLanguage(lang)
    currentLang.value = lang
    langMenu.value = false
}
</script>

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation" style="position:relative;">
        <!-- Mini logo international en haut à gauche -->
        <div style="position:absolute; left:1rem; top:1rem; z-index:101;">
            <img
              src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f310.svg"
              alt="Lang"
              style="width: 28px; cursor: pointer;"
              @click="openLangMenu"
            />
            <div
              v-if="langMenu"
              style="position: absolute; top: 35px; left: 0; background: white; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 2px 8px #0002; z-index: 102; min-width: 80px;"
            >
              <a class="navbar-item" @click="setLang('fr')" :style="{fontWeight: currentLang==='fr'?'bold':'normal'}">FR 🇫🇷</a>
              <a class="navbar-item" @click="setLang('en')" :style="{fontWeight: currentLang==='en'?'bold':'normal'}">EN 🇬🇧</a>
            </div>
        </div>
        <div class="navbar-brand is-flex is-align-items-center">
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
                        <RouterLink class="navbar-item" to="/requests">Carte</RouterLink>
                        <RouterLink class="navbar-item" to="/livreur/form">
                            Demande livreur
                        </RouterLink>
                        <RouterLink class="navbar-item" to="/client/annonce">
                            Déposer une annonce
                        </RouterLink>
                        <RouterLink class="navbar-item" to="/client/box">
                          Mes box de stockage
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
