<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { startSession } from '@/stores/session'
import { api, getLocations, updatePassword, updateSettings } from '@/api.ts'
import router from '@/router'
import type { Location } from '@/types/location.ts'

const session = startSession()
api(session)

const user = session.user!!

const firstname = ref(user.firstname || '')
const name = ref(user.name || '')
const email = ref(user.email || '')
const birthday = ref(user.birthday?.slice(0, 10) || '')
const description = ref(user.description || '')
const notifications = ref(user.notifications ?? false)

const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const savedLocations = ref<Location[]>([])

onMounted(async () => {
    try {
        savedLocations.value = await getLocations()
    } catch (err) {
        console.error(err)
        alert('Erreur lors du chargement du profil.')
    }
})

async function updatePersonalInfo() {
    if (!email.value.includes('@')) {
        alert('Email invalide.')
        return
    }

    try {
        const updatedUser = await updateSettings({
            firstname: firstname.value,
            name: name.value,
            email: email.value,
            birthday: birthday.value,
            description: description.value,
            notifications: notifications.value,
        })
        session.user = updatedUser
        alert('Profil mis à jour')
    } catch (err: any) {
        console.error(err)
        alert(err.response?.data?.message || 'Erreur lors de la mise à jour du profil')
    }
}

async function updatePass() {
    if (!password.value || !newPassword.value || !confirmPassword.value) {
        alert('Tous les champs sont requis')
        return
    }

    if (newPassword.value !== confirmPassword.value) {
        alert('Les mots de passe ne correspondent pas')
        return
    }

    if (newPassword.value.length < 6) {
        alert('Le nouveau mot de passe doit contenir au moins 6 caractères')
        return
    }

    try {
        session.token = await updatePassword(newPassword.value)
        alert('Mot de passe mis à jour')
        password.value = ''
        newPassword.value = ''
        confirmPassword.value = ''
    } catch (err: any) {
        console.error(err)
        alert(err.response?.data?.message || 'Erreur lors du changement de mot de passe')
    }
}

async function deleteAccount() {
    if (!confirm('Confirmer la suppression du compte ?')) return

    try {
        await deleteAccount()
        alert('Compte supprimé')
        router.push('/login')
    } catch (err) {
        console.error(err)
        alert('Erreur lors de la suppression du compte')
    }
}
</script>

<template>
    <div class="settings-layout">
        <header class="navbar">
            <span class="current-route">{{ router.currentRoute.value.fullPath }}</span>
        </header>

        <main class="settings-content">
            <h1 class="title">Paramètres du compte</h1>

            <section class="card-section">
                <h2>Informations personnelles</h2>
                <input class="input" type="text" v-model="firstname" placeholder="Prénom" />
                <input class="input" type="text" v-model="name" placeholder="Nom" />
                <input class="input" type="email" v-model="email" placeholder="Email" />
                <input class="input" type="date" v-model="birthday" placeholder="Date de naissance" />
                <textarea class="input" v-model="description" placeholder="Parle un peu de toi..."></textarea>
                <button class="button green" @click="updatePersonalInfo">Enregistrer</button>
            </section>

            <section class="card-section">
                <h2>Notifications</h2>
                <label>
                    <input type="checkbox" v-model="notifications" />
                    <span class="text">Recevoir des notifications par email</span>
                </label>
            </section>

            <section class="card-section">
                <h2>Lieux enregistrés</h2>
                <ul>
                    <li v-for="(location, i) in savedLocations" :key="i">
                        {{ location.address + ', ' + location.city + ' (' + location.zipcode + ')' }}
                    </li>
                </ul>
            </section>

            <section class="card-section">
                <h2>Changer le mot de passe</h2>
                <input class="input" type="password" v-model="password" placeholder="Mot de passe actuel" />
                <input class="input" type="password" v-model="newPassword" placeholder="Nouveau mot de passe" />
                <input class="input" type="password" v-model="confirmPassword" placeholder="Confirmer" />
                <button class="button blue" @click="updatePass">Mettre à jour</button>
            </section>

            <section class="card-section danger">
                <h2>Supprimer le compte</h2>
                <button class="button red" @click="deleteAccount">Supprimer définitivement</button>
            </section>
        </main>
    </div>
</template>

<style scoped>
.settings-layout {
    background-color: #1e1e1e;
    color: #ffffff;
    min-height: 100vh;
    font-family: sans-serif;
}

.navbar {
    background-color: #1e1e1e;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem 2rem;
}

.current-route {
    color: #a2caa2;
    font-size: 0.9rem;
}

.settings-content {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
}

.card-section {
    background-color: #2c2c2c;
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 2rem;
}

.input {
    background-color: #a2caa2;
    border: none;
    padding: 0.5rem;
    margin: 0.5rem 0;
    width: 100%;
    border-radius: 5px;
    color: black;
}

textarea.input {
    min-height: 80px;
    resize: vertical;
}

.button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
}

.button.green {
    background-color: #09ce44;
    color: white;
}

.button.blue {
    background-color: #146eff;
    color: white;
}

.button.red {
    background-color: #d33;
    color: white;
}

.danger {
    background-color: #2c2c2c;
    border: 1px solid #d33;
}

.role-display {
    margin-top: 0.5rem;
    font-weight: bold;
    color: #ccc;
}
</style>
