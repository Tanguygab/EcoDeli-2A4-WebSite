<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const email = ref('user@example.com')
const name = ref('John Doe')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const notifications = ref(true)
const savedLocations = ref(['Paris', 'Lyon'])

function updateSettings() {
  console.log('Mise à jour du profil', { name: name.value, email: email.value })
}

function updatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  console.log('Changement mot de passe', { password: password.value, newPassword: newPassword.value })
}

function deleteAccount() {
  if (confirm('Confirmer la suppression du compte ?')) {
    console.log('Compte supprimé')
  }
}
</script>

<template>
  <div class="settings-layout">
    <header class="navbar">
      <div class="logo">ECODELI</div>
      <div class="nav-right">
        <span class="current-route">{{ route.fullPath }}</span>
        <router-link to="/annonce" class="button green">Annonce</router-link>
        <router-link to="/login" class="button green">Me Connecter</router-link>
      </div>
    </header>

    <main class="settings-content">
      <h1 class="title">Paramètres du compte</h1>

      <section class="card-section">
        <h2>Informations personnelles</h2>
        <input class="input" type="text" v-model="name" placeholder="Nom" />
        <input class="input" type="email" v-model="email" placeholder="Email" />
        <button class="button green" @click="updateSettings">Enregistrer</button>
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
          <li v-for="(loc, i) in savedLocations" :key="i">{{ loc }}</li>
        </ul>
      </section>

      <section class="card-section">
        <h2>Changer le mot de passe</h2>
        <input class="input" type="password" v-model="password" placeholder="Mot de passe actuel" />
        <input class="input" type="password" v-model="newPassword" placeholder="Nouveau mot de passe" />
        <input class="input" type="password" v-model="confirmPassword" placeholder="Confirmer" />
        <button class="button blue" @click="updatePassword">Mettre à jour</button>
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
  background-color: #2A2A2A;
  color: #FFFFFF;
  min-height: 100vh;
  font-family: sans-serif;
}

.navbar {
  background-color: #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #09CE44;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-route {
  color: #A2CAA2;
  font-size: 0.9rem;
}

.settings-content {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.card-section {
  background-color: #333333;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.input {
  background-color: #A2CAA2;
  border: none;
  padding: 0.5rem;
  margin: 0.5rem 0;
  width: 100%;
  border-radius: 5px;
  color: black;
}

.button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}

.button.green {
  background-color: #09CE44;
  color: white;
}

.button.blue {
  background-color: #146EFF;
  color: white;
}

.button.red {
  background-color: #D33;
  color: white;
}

.danger {
  background-color: #333;
  border: 1px solid #D33;
}
</style>
