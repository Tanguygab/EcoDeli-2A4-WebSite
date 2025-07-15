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
const image = ref<File | null>(null)
const tutorial = ref(user.tutorial ?? false)

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

function handleImageUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (files && files.length > 0) {
        image.value = files[0]
    }
}

async function updatePersonalInfo() {
    if (!email.value.includes('@')) {
        alert('Email invalide.')
        return
    }

    const formData = new FormData()
    formData.append('firstname', firstname.value)
    formData.append('name', name.value)
    formData.append('email', email.value)
    formData.append('birthday', birthday.value)
    formData.append('description', description.value)
    formData.append('notifications', String(notifications.value))
    formData.append('tutorial', String(tutorial.value))
    if (image.value) {
        formData.append('image', image.value)
    }

    try {
        const updatedUser = await updateSettings(formData)
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
  <div class="container is-max-desktop mt-6">
    <div class="box">
      <h1 class="title has-text-centered mb-5">Paramètres du compte</h1>
      <form @submit.prevent="updatePersonalInfo">
        <!-- Informations personnelles -->
        <div class="field">
          <label class="label">Prénom</label>
          <div class="control">
            <input class="input" type="text" v-model="firstname" placeholder="Prénom" />
          </div>
        </div>
        <div class="field">
          <label class="label">Nom</label>
          <div class="control">
            <input class="input" type="text" v-model="name" placeholder="Nom" />
          </div>
        </div>
        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-right">
            <input class="input" type="email" v-model="email" placeholder="Email" />
            <span class="icon is-small is-right">
              <i class="fas fa-envelope"></i>
            </span>
          </div>
        </div>
        <div class="field">
          <label class="label">Date de naissance</label>
          <div class="control">
            <input class="input" type="date" v-model="birthday" placeholder="Date de naissance" />
          </div>
        </div>
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea class="textarea" v-model="description" placeholder="Parle un peu de toi..."></textarea>
          </div>
        </div>
        <div class="field">
          <label class="label">Image de profil</label>
          <div class="file is-boxed is-success has-name is-fullwidth custom-file">
            <label class="file-label">
              <input class="file-input" type="file" accept="image/*" @change="handleImageUpload" />
              <span class="file-cta custom-file-cta">
                <span class="file-icon"><i class="fas fa-upload" /></span>
                <span class="file-label custom-file-label">Choisir un fichier…</span>
              </span>
              <span class="file-name">{{ image?.name || 'Aucun fichier' }}</span>
            </label>
          </div>
        </div>
        <div class="field mt-4">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="tutorial" />
            <span class="custom-checkmark"></span>
            <span class="ml-2">Afficher le tutoriel à la connexion</span>
          </label>
        </div>
        <div class="field mt-4">
          <button class="button is-success is-fullwidth" type="submit">Enregistrer</button>
        </div>
      </form>

      <!-- Notifications -->
      <div class="field mt-5">
        <label class="label">Notifications</label>
        <label class="custom-checkbox">
          <input type="checkbox" v-model="notifications" />
          <span class="custom-checkmark"></span>
          <span class="ml-2">Recevoir des notifications par email</span>
        </label>
      </div>

      <!-- Lieux enregistrés -->
      <div class="field mt-5">
        <label class="label">Lieux enregistrés</label>
        <div class="content">
          <ul>
            <li v-for="(location, i) in savedLocations" :key="i">
              {{ location.address + ', ' + location.city + ' (' + location.zipcode + ')' }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Changer le mot de passe -->
      <form @submit.prevent="updatePass" class="mt-5">
        <label class="label">Changer le mot de passe</label>
        <div class="field">
          <input class="input" type="password" v-model="password" placeholder="Mot de passe actuel" />
        </div>
        <div class="field">
          <input class="input" type="password" v-model="newPassword" placeholder="Nouveau mot de passe" />
        </div>
        <div class="field">
          <input class="input" type="password" v-model="confirmPassword" placeholder="Confirmer" />
        </div>
        <div class="field">
          <button class="button is-link is-fullwidth" type="submit">Mettre à jour</button>
        </div>
      </form>

      <!-- Supprimer le compte -->
      <div class="field mt-5">
        <label class="label has-text-danger">Supprimer le compte</label>
        <button class="button is-danger is-fullwidth" @click="deleteAccount">Supprimer définitivement</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 3rem;
}
.box {
  background: #222;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px #0004;
  padding: 2rem 2.5rem;
}
.label {
  color: #a2caa2;
}
.input, .textarea {
  background: #a2caa2;
  color: #222;
}
.button.is-success {
  background: #09ce44;
  color: #fff;
}
.button.is-link {
  background: #146eff;
  color: #fff;
}
.button.is-danger {
  background: #d33;
  color: #fff;
}
.custom-file-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100px;
}
.custom-file-label {
  display: block;
  width: 100%;
  text-align: center;
  margin-top: 0.5rem;
}
.file-name {
  color: #222;
  text-align: center;
  width: 100%;
  display: block;
  margin-top: 0.5rem;
}

/* Custom round checkbox */
.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  user-select: none;
}
.custom-checkbox input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}
.custom-checkmark {
  height: 22px;
  width: 22px;
  background-color: #222;
  border: 2px solid #09ce44;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  transition: background 0.2s;
  margin-right: 8px;
}
.custom-checkbox input:checked ~ .custom-checkmark {
  background-color: #09ce44;
  border-color: #09ce44;
}
.custom-checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.custom-checkbox input:checked ~ .custom-checkmark:after {
  display: block;
}
.custom-checkbox .custom-checkmark:after {
  left: 6px;
  top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}
</style>
