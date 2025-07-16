<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import Logo from '../Logo.vue'
import router from '@/router'
import { isSessionValid } from '@/api'
import i18next from "i18next"

isSessionValid(true)

const burgerMenu = ref(false)
function toggleBurgerMenu() {
    burgerMenu.value = !burgerMenu.value
}

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

const pages = [
    {
        id: "manage",
        name: "Gestion",
        prefix: "Gestion des",
        children: {
            "users": "utilisateurs",
            "traders": "commerçants",
            "contracts": "contrats",
            "candidature": "Candidatures livreurs",
            "prestataires": "prestataires",
            "deliveries": "livraisons"
        },
    },
    {
        id: "prestations",
        name: "Prestations",
        children: {
            "prestations": "Gestion des prestations",
            "follow-ups": "Suivi des prestations"
        },
    },
    {
        id: "finance",
        name: "Finances",
        prefix: "Gestion",
        children: {
            "payments": "des paiements",
            "bills": "des factures",
            "finance": "financière",
        },
    },
]
</script>

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <Logo :link="router.currentRoute.value.path === '/backoffice' ? '/' : '/backoffice'" />

            <a :class="'navbar-burger' + (burgerMenu ? ' is-active' : '')" aria-label="menu" :aria-expanded="burgerMenu"
                @click="toggleBurgerMenu()">
                <span v-for="i in [0, 1, 2, 3]" aria-hidden="true"></span>
            </a>
        </div>

        <div :class="'navbar-menu' + (burgerMenu ? ' is-active' : '')">
            <div class="navbar-start" style="display: flex; align-items: center;">
                <!-- Bouton SSH à côté de Gestion -->
                <RouterLink class="navbar-item" to="/backoffice/ssh">
                    <span class="icon"><i class="fas fa-terminal"></i></span> SSH
                </RouterLink>

                <div v-for="page in pages" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">{{ page.name }}</a>
                    <div class="navbar-dropdown is-boxed">
                        <RouterLink v-for="(name, link) in page.children" class="navbar-item" :to="'/backoffice/' + link">
                            {{ (page.prefix ? page.prefix + " " : "") + name }}
                        </RouterLink>
                    </div>
                </div>
            </div>

            <div class="navbar-end" style="display: flex; align-items: center;">
                <!-- Logo international pour la langue à droite -->
                <div style="margin-right: 1rem; position: relative;">
                    <img
                      src="https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/1f310.svg"
                      alt="Lang"
                      style="width: 28px; cursor: pointer;"
                      @click="openLangMenu"
                    />
                    <div
                      v-if="langMenu"
                      style="position: absolute; top: 35px; right: 0; background: white; border: 1px solid #ddd; border-radius: 6px; box-shadow: 0 2px 8px #0002; z-index: 102; min-width: 80px;"
                    >
                      <a class="navbar-item" @click="setLang('fr')" :style="{fontWeight: currentLang==='fr'?'bold':'normal'}">FR</a>
                      <a class="navbar-item" @click="setLang('en')" :style="{fontWeight: currentLang==='en'?'bold':'normal'}">EN</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>
