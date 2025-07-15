<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Candidature {
  _id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  justificatif: string
  status: 'pending' | 'accepted' | 'refused'
}

const candidatures = ref<Candidature[]>([
  {
    _id: 1,
    firstname: 'Jean',
    lastname: 'Dupont',
    email: 'jean.dupont@email.fr',
    phone: '0601020304',
    justificatif: 'justif1.pdf',
    status: 'pending'
  },
  {
    _id: 2,
    firstname: 'Marie',
    lastname: 'Durand',
    email: 'marie.durand@email.fr',
    phone: '0605060708',
    justificatif: 'justif2.pdf',
    status: 'pending'
  }
])

function acceptCandidature(id: number) {
  const cand = candidatures.value.find(c => c._id === id)
  if (cand) cand.status = 'accepted'
}

function refuseCandidature(id: number) {
  const cand = candidatures.value.find(c => c._id === id)
  if (cand) cand.status = 'refused'
}
</script>

<template>
  <h2 class="title">Candidatures Livreurs</h2>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>Prénom</th>
        <th>Nom</th>
        <th>Email</th>
        <th>Téléphone</th>
        <th>Justificatif</th>
        <th>Statut</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cand in candidatures" :key="cand._id">
        <td>{{ cand.firstname }}</td>
        <td>{{ cand.lastname }}</td>
        <td>{{ cand.email }}</td>
        <td>{{ cand.phone }}</td>
        <td>
          <a :href="'/uploads/' + cand.justificatif" target="_blank">Voir</a>
        </td>
        <td>
          <span v-if="cand.status === 'pending'" class="has-text-warning">En attente</span>
          <span v-if="cand.status === 'accepted'" class="has-text-success">Acceptée</span>
          <span v-if="cand.status === 'refused'" class="has-text-danger">Refusée</span>
        </td>
        <td>
          <button
            class="button is-success is-small mr-2"
            @click="acceptCandidature(cand._id)"
            :disabled="cand.status !== 'pending'"
          >
            Accepter
          </button>
          <button
            class="button is-danger is-small"
            @click="refuseCandidature(cand._id)"
            :disabled="cand.status !== 'pending'"
          >
            Recaler
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
