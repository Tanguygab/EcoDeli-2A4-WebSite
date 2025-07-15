<script setup lang="ts">
import { ref } from 'vue'

const boxes = ref([
  { id: 1, name: 'Box Paris', status: 'Loué', date: '2025-07-15' },
  { id: 2, name: 'Box Lyon', status: 'Disponible', date: '' }
])

function reserveBox(boxId: number) {
  alert('Box réservée !')
}
</script>

<template>
  <div class="box">
    <h2 class="title is-4 mb-4">Mes box de stockage</h2>
    <table class="table is-fullwidth">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Statut</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="box in boxes" :key="box.id">
          <td>{{ box.name }}</td>
          <td>{{ box.status }}</td>
          <td>{{ box.date }}</td>
          <td>
            <button
              v-if="box.status === 'Disponible'"
              class="button is-success is-small"
              @click="reserveBox(box.id)"
            >
              Réserver
            </button>
            <span v-else>—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>