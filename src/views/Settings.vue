<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { startSession } from '@/stores/session'
import { api, deleteAccount, getLocations, saveLocation, updatePassword, updateSettings, updateProfile } from '@/api.ts'
import router from '@/router'
import type { Location } from '@/types/location.ts'
import LocationSaver from '@/components/location/LocationSaver.vue'

const session = startSession()
api(session)

const user = session.user!!

const firstname = ref(user.firstname || '')
const name = ref(user.name || '')
const email = ref(user.email || '')
const birthday = ref((user.birthday instanceof Date ? user.birthday.toLocaleDateString() : user.birthday?.slice(0,10)) || '')
const description = ref(user.description || '')
const image = ref<File | null>(null)
const tutorial = ref(user.tutorial ?? false)

const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const savedLocations = ref<Location[]>([])

const addingLocation = ref<boolean>(false)
const newLocation = ref<Location>({city: "", address: "", zipcode: ""})

function handleImageUpload(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (files && files.length > 0) {
        image.value = files[0]
    }
}

function saveLoc() {
    if (!newLocation.value) return
    addingLocation.value = false
    saveLocation(newLocation.value)
    savedLocations.value.push({...newLocation.value})
    newLocation.value = {city: "", address: "", zipcode: ""}
}

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

    const formData = new FormData()
    formData.append('firstname', firstname.value)
    formData.append('name', name.value)
    formData.append('email', email.value)
    formData.append('birthday', birthday.value)
    formData.append('description', description.value)
    formData.append('tutorial', String(tutorial.value))
    if (image.value) {
        formData.append('image', image.value)
    }

    try {
        const updatedUser = await updateProfile(formData)
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
        alert(err.response?.data?.message || 'Erreur lors du changement du mot de passe')
    }
}

async function delAccount() {
    if (!confirm('Confirmer la suppression du compte ?')) return

    try {
        await deleteAccount()
        session.saveToken("")
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
            <h1 class="title">Paramètres du compte</h1>
        </header>

        <main class="settings-content">
            <section class="card-section">
                <h2>Informations personnelles</h2>
                <input class="input" type="text" v-model="firstname" placeholder="Prénom" />
                <input class="input" type="text" v-model="name" placeholder="Nom" />
                <input class="input" type="email" v-model="email" placeholder="Email" />
                <input class="input" type="date" v-model="birthday" placeholder="Date de naissance" />
                <textarea class="input" v-model="description" placeholder="Parle un peu de toi..."></textarea>
                <!-- Upload image -->
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
                <!-- Case tutoriel -->
                <div class="field mt-4">
                  <label class="custom-checkbox">
                    <input type="checkbox" v-model="tutorial" />
                    <span class="custom-checkmark"></span>
                    <span class="ml-2">Afficher le tutoriel à la connexion</span>
                  </label>
                </div>
                <button class="button green mt-3" @click="updatePersonalInfo">Enregistrer</button>
            </section>

            <section class="card-section">
                <h2>Lieux enregistrés</h2>
                <ul>
                    <li v-for="(location, i) in savedLocations" :key="i">
                        {{ location.address + ', ' + location.city + ' (' + location.zipcode + ')' }}
                    </li>
                </ul>
                <div v-if="addingLocation">
                    <LocationSaver v-model="newLocation" />
                    <button class="button green mt-2" @click="saveLoc">Enregistrer ce lieu</button>
                </div>
                <button v-else class="button green mt-2" @click="addingLocation = true">Ajouter un lieu</button>
            </section>

            <section class="card-section">
                <h2>Changer le mot de passe</h2>
                <input class="input" type="password" v-model="password" placeholder="Mot de passe actuel" />
                <input class="input" type="password" v-model="newPassword" placeholder="Nouveau mot de passe" />
                <input class="input" type="password" v-model="confirmPassword" placeholder="Confirmer" />
                <button class="button blue mt-3" @click="updatePass">Mettre à jour</button>
            </section>

            <section class="card-section danger">
                <h2>Supprimer le compte</h2>
                <button class="button red mt-3" @click="delAccount">Supprimer définitivement</button>
            </section>
        </main>
    </div>
</template>

<style scoped>
.settings-layout {
    background: #222;
    color: #fff;
    min-height: 100vh;
}
.navbar {
    padding: 1rem 2rem;
}
.settings-content {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: #222;
    border-radius: 12px;
    box-shadow: 0 2px 16px #0004;
}
.card-section {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #333;
}
.card-section:last-child {
    border-bottom: none;
}
.input, textarea.input {
    background: #a2caa2;
    color: #222;
    margin-bottom: 1rem;
}
.button.green {
    background: #09ce44;
    color: #fff;
    border: none;
}
.button.blue {
    background: #146eff;
    color: #fff;
    border: none;
}
.button.red {
    background: #d33;
    color: #fff;
    border: none;
}
.checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-top: 0.5rem;
}
.ml-2 {
    margin-left: 0.5rem;
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
</style>
