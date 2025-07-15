<template>
  <div class="planning-page p-6">
    <h2 class="title is-4 mb-4">Mon planning de livraisons</h2>
    <div class="box">
      <table class="table is-fullwidth">
        <thead>
          <tr>
            <th>Date</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="slot in slots" :key="slot.id">
            <td>{{ slot.date }}</td>
            <td>{{ slot.start }}</td>
            <td>{{ slot.end }}</td>
            <td>
              <button class="button is-warning is-small mr-2" @click="openEditModal(slot)">Modifier</button>
              <button class="button is-danger is-small" @click="deleteSlot(slot.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="button is-success mt-3" @click="openAddModal">Ajouter un créneau</button>
    </div>

    <div v-if="showModal" class="modal is-active">
      <div class="modal-background" @click="showModal = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ modalType === 'add' ? 'Ajouter un créneau' : 'Modifier le créneau' }}
          </p>
          <button class="delete" aria-label="close" @click="showModal = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Date</label>
            <input v-model="currentSlot!.date" class="input" type="date" />
          </div>
          <div class="field">
            <label class="label">Début</label>
            <input v-model="currentSlot!.start" class="input" type="time" />
          </div>
          <div class="field">
            <label class="label">Fin</label>
            <input v-model="currentSlot!.end" class="input" type="time" />
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="saveSlot">Confirmer</button>
          <button class="button" @click="showModal = false">Annuler</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Slot {
  id: number
  date: string
  start: string
  end: string
}

const slots = ref<Slot[]>([
  { id: 1, date: '2025-07-16', start: '08:00', end: '12:00' },
  { id: 2, date: '2025-07-17', start: '14:00', end: '18:00' }
])

const showModal = ref(false)
const modalType = ref<'add' | 'edit' | null>(null)
const currentSlot = ref<Slot | null>(null)

function openAddModal() {
  modalType.value = 'add'
  currentSlot.value = { id: Date.now(), date: '', start: '', end: '' }
  showModal.value = true
}

function openEditModal(slot: Slot) {
  modalType.value = 'edit'
  currentSlot.value = { ...slot }
  showModal.value = true
}

function saveSlot() {
  if (modalType.value === 'add' && currentSlot.value) {
    slots.value.push({ ...currentSlot.value })
  } else if (modalType.value === 'edit' && currentSlot.value) {
    const idx = slots.value.findIndex(s => s.id === currentSlot.value!.id)
    if (idx !== -1) slots.value[idx] = { ...currentSlot.value }
  }
  showModal.value = false
}

function deleteSlot(id: number) {
  slots.value = slots.value.filter(s => s.id !== id)
}
</script>

<style scoped>
.planning-page {
  max-width: 700px;
  margin: auto;
}
</style>
