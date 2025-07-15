<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  justificatif: null as File | null
})

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  form.value.justificatif = input.files[0]
}

function submitForm() {
  // Ici tu pourras ajouter l'appel API pour envoyer la demande
  alert('Demande envoyée !')
}
</script>

<template>
  <div class="box">
    <h2 class="title is-4 mb-4">Demande de recrutement livreur</h2>
    <div class="field">
      <label class="label">Prénom</label>
      <input v-model="form.firstname" class="input" type="text" />
    </div>
    <div class="field">
      <label class="label">Nom</label>
      <input v-model="form.lastname" class="input" type="text" />
    </div>
    <div class="field">
      <label class="label">Email</label>
      <input v-model="form.email" class="input" type="email" />
    </div>
    <div class="field">
      <label class="label">Téléphone</label>
      <input v-model="form.phone" class="input" type="tel" />
    </div>
    <div class="field">
      <label class="label">Pièce justificative</label>
      <input class="input" type="file" @change="handleFileChange" />
    </div>
    <button class="button is-success mt-3" @click="submitForm">Envoyer la demande</button>
  </div>
</template>