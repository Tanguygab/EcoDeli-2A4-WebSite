<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  title: '',
  description: '',
  date: '',
  location: ''
})

function submitForm() {
  alert('Annonce déposée !')
}
</script>

<template>
  <div class="box">
    <h2 class="title is-4 mb-4">Déposer une annonce</h2>
    <div class="field">
      <label class="label">Titre</label>
      <input v-model="form.title" class="input" type="text" />
    </div>
    <div class="field">
      <label class="label">Description</label>
      <textarea v-model="form.description" class="textarea"></textarea>
    </div>
    <div class="field">
      <label class="label">Date</label>
      <input v-model="form.date" class="input" type="date" />
    </div>
    <div class="field">
      <label class="label">Lieu</label>
      <input v-model="form.location" class="input" type="text" />
    </div>
    <button class="button is-success mt-3" @click="submitForm">Déposer</button>
  </div>
</template>