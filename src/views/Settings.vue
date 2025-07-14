<script setup lang="ts">
import { ref } from 'vue'

const email = ref('user@example.com')
const name = ref('John Doe')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const notifications = ref(true)
const savedLocations = ref(['Paris', 'Lyon'])

function updateSettings() {
  console.log('Mise à jour des infos', { name: name.value, email: email.value, notifications: notifications.value })
}

function updatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  console.log('Mot de passe changé', { password: password.value, newPassword: newPassword.value })
}

function deleteAccount() {
  if (confirm('Supprimer le compte ?')) {
    console.log('Compte supprimé')
  }
}
</script>

<template>
  <div class="settings-page">
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
        <span class="text">Recevoir des notifications</span>
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
      <input class="input" type="password" v-model="confirmPassword" placeholder="Confirmer le mot de passe" />
      <button class="button blue" @click="updatePassword">Mettre à jour</button>
    </section>
    <section class="card-section danger">
      <h2>Supprimer le compte</h2>
      <button class="button red" @click="deleteAccount">Supprimer définitivement</button>
    </section>
  </div>
</template>

<style scoped>
.settings-page {
  background-color: #2A2A2A;
  color: white;
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  font-family: sans-serif;
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
  margin-top: 1rem;
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
