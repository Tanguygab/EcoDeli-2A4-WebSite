<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDeliveryApplications, updateDeliveryApplicationStatus } from '@/api'

interface Candidature {
  _id: string
  firstname: string
  lastname: string
  email: string
  phone: string
  justificatif: string
  status: 'pending' | 'accepted' | 'refused'
}

const candidatures = ref<Candidature[]>([])

onMounted(async () => {
  candidatures.value = await getDeliveryApplications() as Candidature[]
})

async function acceptCandidature(id: string) {
  await updateDeliveryApplicationStatus(id, 'accepted')
  const cand = candidatures.value.find(c => c._id === id)
  if (cand) cand.status = 'accepted'
}

async function refuseCandidature(id: string) {
  await updateDeliveryApplicationStatus(id, 'refused')
  const cand = candidatures.value.find(c => c._id === id)
  if (cand) cand.status = 'refused'
}
</script>

<template>
  <h2 class="title">{{ $t('table.deliverymen.title') }}</h2>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>{{ $t('table.deliverymen.firstname') }}</th>
        <th>{{ $t('table.deliverymen.lastname') }}</th>
        <th>{{ $t('table.deliverymen.email') }}</th>
        <th>{{ $t('table.deliverymen.phone') }}</th>
        <th>{{ $t('table.deliverymen.justificatif') }}</th>
        <th>{{ $t('table.deliverymen.status') }}</th>
        <th>{{ $t('table.deliverymen.actions') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cand in candidatures" :key="cand._id">
        <td>{{ cand.firstname }}</td>
        <td>{{ cand.lastname }}</td>
        <td>{{ cand.email }}</td>
        <td>{{ cand.phone }}</td>
        <td>
          <a :href="'/uploads/' + cand.justificatif" target="_blank">{{ $t('table.deliverymen.see') }}</a>
        </td>
        <td>
          <span v-if="cand.status === 'pending'" class="has-text-warning">{{ $t('table.deliverymen.pending') }}</span>
          <span v-if="cand.status === 'accepted'" class="has-text-success">{{ $t('table.deliverymen.accepted') }}</span>
          <span v-if="cand.status === 'refused'" class="has-text-danger">{{ $t('table.deliverymen.refused') }}</span>
        </td>
        <td>
          <button
            class="button is-success is-small mr-2"
            @click="acceptCandidature(cand._id)"
            :disabled="cand.status !== 'pending'"
          >
            {{ $t('table.deliverymen.accept') }}
          </button>
          <button
            class="button is-danger is-small"
            @click="refuseCandidature(cand._id)"
            :disabled="cand.status !== 'pending'"
          >
            {{ $t('table.deliverymen.refuse') }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
