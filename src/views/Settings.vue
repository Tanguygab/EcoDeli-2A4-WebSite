<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useSessionStore } from '@/stores/session'

const router = useRouter()
const route = useRoute()
const session = useSessionStore()

const API_URL = 'http://88.172.140.59:51000'


const email = ref('')
const name = ref('')
const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const notifications = ref(false)
const savedLocations = ref<string[]>([])


onMounted(async () => {
  try {
    const res = await axios.get(`${API_URL}/users/${session.user._id}`, {
      headers: { Authorization: `Bearer ${session.token}` },
    })

    name.value = res.data.name
    email.value = res.data.email
    notifications.value = res.data.notifications ?? false
    savedLocations.value = res.data.savedLocations ?? []
  } catch (err) {
    console.error(err)
    alert("Erreur lors du chargement du profil.")
  }
})

async function updatePersonalInfo() {
  if (!email.value.includes('@')) {
    alert("Email invalide.")
    return
  }

  try {
    await axios.put(`${API_URL}/users/${session.user._id}`, {
      name: name.value,
      email: email.value,
      notifications: notifications.value,
    }, {
      headers: { Authorization: `Bearer ${session.token}` },
    })

    alert('Profil mis à jour')
  } catch (err: any) {
    console.error(err)
    alert(err.response?.data?.message || "Erreur lors de la mise à jour")
  }
}


async function updatePassword() {
  if (!password.value || !newPassword.value || !confirmPassword.value) {
    alert("Tous les champs sont requis")
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert("Les mots de passe ne correspondent pas")
    return
  }

  if (newPassword.value.length < 6) {
    alert("Le nouveau mot de passe doit contenir au moins 6 caractères")
    return
  }

  try {
    await axios.put(`${API_URL}/users/${session.user._id}`, {
      password: password.value,
      newPassword: newPassword.value,
    }, {
      headers: { Authorization: `Bearer ${session.token}` },
    })

    alert("Mot de passe mis à jour")
    password.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err: any) {
    console.error(err)
    alert(err.response?.data?.message || "Erreur lors du changement de mot de passe")
  }
}

async function deleteAccount() {
  if (!confirm('Confirmer la suppression du compte ?')) return

  try {
    await axios.delete(`${API_URL}/users/${session.user._id}`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    })
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
      <span class="current-route">{{ route.fullPath }}</span>
    </header>

    <main class="settings-content">
      <h1 class="title">Paramètres du compte</h1>

      <section class="card-section">
        <h2>Informations personnelles</h2>
        <input class="input" type="text" v-model="name" placeholder="Nom" />
        <input class="input" type="email" v-model="email" placeholder="Email" />
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
</style>
