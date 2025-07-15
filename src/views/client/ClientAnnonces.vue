<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startSession } from '@/stores/session'
import { api, getClientAnnonces, createClientAnnonce } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'


const session = startSession()
api(session)
const user = session.user

const pagination = newPagination()
const annonces = ref<any[]>([])
const loading = ref(false)
const showForm = ref(false)
const search = ref('')

const form = ref({
  title: '',
  description: '',
  date: '',
  location: ''
})

async function loadAnnonces() {
  loading.value = true
  try {
    annonces.value = await getClientAnnonces(pagination)
  } catch (e) {
    alert('Erreur lors du chargement des annonces')
  } finally {
    loading.value = false
  }
}

function openForm() {
  form.value = { title: '', description: '', date: '', location: '' }
  showForm.value = true
}

async function submitForm() {
  if (!form.value.title || !form.value.description) {
    alert('Titre et description requis')
    return
  }
  try {
    await createClientAnnonce(form.value)
    await loadAnnonces()
    showForm.value = false
  } catch (e) {
    alert('Erreur lors du dépôt')
  }
}

function filteredAnnonces() {
  if (!search.value.trim()) return annonces.value
  return annonces.value.filter(a =>
    a.title.toLowerCase().includes(search.value.trim().toLowerCase())
  )
}

onMounted(loadAnnonces)
</script>

<template>
  <div class="client-annonces">
    <h1 class="title has-text-centered mb-4">{{ $t('client.annonces.title') }}</h1>


    <div class="field mb-4" style="max-width:400px;margin:auto;">
      <div class="control has-icons-right">
        <input
          v-model="search"
          class="input"
          type="text"
          :placeholder="$t('client.annonces.search')"
        />
        <span class="icon is-small is-right">
          <i class="fas fa-search"></i>
        </span>
      </div>
    </div>

    <div v-if="loading" class="loading">Chargement…</div>

    <div v-else class="cards">
      <div v-for="a in filteredAnnonces()" :key="a._id" class="box mb-3">
        <h3 class="is-size-5 has-text-weight-bold">{{ a.title }}</h3>
        <div>{{ a.description }}</div>
        <div class="is-size-7 has-text-grey">{{ a.date }} • {{ a.location }}</div>
      </div>
      <div style="flex:0 0 200px" />
    </div>

 
    <button class="button is-link is-rounded is-medium add-btn" type="button" @click="openForm">
      <span class="icon"><i class="fas fa-plus" /></span>
      <span>{{ $t('client.annonces.add') }}</span>
    </button>


    <div v-if="showForm" class="modal is-active">
      <div class="modal-background" @click="showForm = false" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ $t('client.annonces.add') }}</p>
          <button class="delete" @click="showForm = false" />
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">{{ $t('client.annonces.form.title') }}</label>
            <input v-model="form.title" class="input" type="text" />
          </div>
          <div class="field">
            <label class="label">{{ $t('client.annonces.form.description') }}</label>
            <textarea v-model="form.description" class="textarea"></textarea>
          </div>
          <div class="field">
            <label class="label">{{ $t('client.annonces.form.date') }}</label>
            <input v-model="form.date" class="input" type="date" />
          </div>
          <div class="field">
            <label class="label">{{ $t('client.annonces.form.location') }}</label>
            <input v-model="form.location" class="input" type="text" />
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="submitForm">{{ $t('client.annonces.form.submit') }}</button>
          <button class="button" @click="showForm = false">Annuler</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.loading { text-align: center; padding: 2rem; }
.add-btn {
  margin: 2rem auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>