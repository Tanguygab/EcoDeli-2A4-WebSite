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
  console.log('Mise à jour du profil avec', { name: name.value, email: email.value, notifications: notifications.value })
}

function updatePassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  console.log('Changement du mot de passe avec', { password: password.value, newPassword: newPassword.value })
}

function deleteAccount() {
  if (confirm('Es-tu sûr de vouloir supprimer ton compte ?')) {
    console.log('Compte supprimé')
  }
}
</script>

<template>
  <div class="settings-page">
    <h1 class="title">Paramètres du compte</h1>
    <section>
      <h2 class="subtitle">Informations personnelles</h2>
      <div class="field">
        <label class="label">Nom</label>
        <input class="input" type="text" v-model="name" />
      </div>
      <div class="field">
        <label class="label">Email</label>
        <input class="input" type="email" v-model="email" />
      </div>
      <button class="button is-primary mt-2" @click="updateSettings">Enregistrer</button>
    </section>
    <section>
      <h2 class="subtitle">Notifications</h2>
      <label class="checkbox">
        <input type="checkbox" v-model="notifications" />
        Recevoir des notifications par email
      </label>
    </section>
    <section>
      <h2 class="subtitle">Lieux enregistrés</h2>
      <ul>
        <li v-for="(loc, i) in savedLocations" :key="i">{{ loc }}</li>
      </ul>
    </section>
    <section>
      <h2 class="subtitle">Changer le mot de passe</h2>
      <div class="field">
        <label class="label">Mot de passe actuel</label>
        <input class="input" type="password" v-model="password" />
      </div>
      <div class="field">
        <label class="label">Nouveau mot de passe</label>
        <input class="input" type="password" v-model="newPassword" />
      </div>
      <div class="field">
        <label class="label">Confirmer le nouveau mot de passe</label>
        <input class="input" type="password" v-model="confirmPassword" />
      </div>
      <button class="button is-link mt-2" @click="updatePassword">Mettre à jour le mot de passe</button>
    </section>
    <section>
      <h2 class="subtitle has-text-danger">Supprimer le compte</h2>
      <button class="button is-danger" @click="deleteAccount">Supprimer définitivement</button>
    </section>
  </div>
</template>
<style scoped>
.settings-page {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  font-family: sans-serif;
}
.field {
  margin-bottom: 1rem;
}
.subtitle {
  margin-top: 2rem;
  font-weight: bold;
}
</style>
