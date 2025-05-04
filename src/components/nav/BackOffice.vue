<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import Logo from '../Logo.vue'

const burgerMenu = ref(false)

function toggleBurgerMenu() {
    burgerMenu.value = !burgerMenu.value
}

const pages = [
    {
        id: "manage",
        name: "Gestion",
        prefix: "Gestion des",
        children: {
            "traders": "commerçants",
            "contracts": "contrats",
            "deliverymen": "livreurs",
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
            "payments": "des paiments",
            "bills": "des factures",
            "finance": "financière",
        },
    },
]

</script>

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <Logo link="/backoffice" />

            <a :class="'navbar-burger' + (burgerMenu ? ' is-active' : '')" aria-label="menu" :aria-expanded="burgerMenu"
                @click="toggleBurgerMenu()">
                <span v-for="i in [0, 1, 2, 3]" aria-hidden="true"></span>
            </a>
        </div>

        <div :class="'navbar-menu' + (burgerMenu ? ' is-active' : '')">
            <div class="navbar-start">

                <div v-for="page in pages" class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">{{ page.name }}</a>
                    <div class="navbar-dropdown is-boxed">
                        <RouterLink v-for="name, link in page.children" class="navbar-item" :to="'/backoffice/' + link">
                            {{ (page.prefix ? page.prefix + " " : "") + name }}
                        </RouterLink>
                    </div>
                </div>

            </div>

            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <!-- <RouterLink to="register" class="button is-primary">S'inscrire</RouterLink> -->
                        <!-- <RouterLink to="login" class="button is-light">Se connecter</RouterLink> -->
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>