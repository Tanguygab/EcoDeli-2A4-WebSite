<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { VPdfViewer } from '@vue-pdf-viewer/viewer'
import { getDeliveryApplications, getUser, deleteProof, updateUserRole as apiUpdateUserRole } from '@/api'
import Pages from '@/components/Pages.vue'

const proofs = ref<any[]>([])
const users = ref<Record<number, any>>({})
const pdf = ref<string | null>(null)
const pagination = ref({ page: 0, limit: 5, filter: '', ascending: true }) 

onMounted(async () => {
  proofs.value = await getDeliveryApplications(pagination.value)
  for (const proof of proofs.value) {
    if (!users.value[proof.user]) {
      users.value[proof.user] = await getUser(proof.user)
    }
  }
})

const paginatedProofs = computed(() => {
  const start = pagination.value.page * pagination.value.limit
  const end = start + pagination.value.limit
  return proofs.value.slice(start, end)
})


function changePage(page: number) {
  pagination.value.page = page
}

async function handleDelete(proof: any) {
  await deleteProof(proof._id)
  proofs.value = proofs.value.filter(p => p._id !== proof._id)
}

async function handleValidate(proof: any) {
  
  await apiUpdateUserRole(proof.user, 6)
 
  const userProofs = proofs.value.filter(p => p.user === proof.user)
  for (const p of userProofs) {
    await deleteProof(p._id)
  }
 
  proofs.value = proofs.value.filter(p => p.user !== proof.user)
}
</script>

<template>
  <h2 class="title">{{ $t('table.deliverymen.title') }}</h2>
  <table class="table is-fullwidth">
    <thead>
      <tr>
        <th>{{ $t('table.deliverymen.lastname') }}</th>
        <th>{{ $t('table.deliverymen.firstname') }}</th>
        <th>{{ $t('table.deliverymen.email') }}</th>
        <th>{{ $t('table.deliverymen.date') }}</th>
        <th>{{ $t('table.deliverymen.justificatif') }}</th>
        <th>{{ $t('table.deliverymen.actions') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="proof in paginatedProofs" :key="proof._id">
        <td>{{ users[proof.user]?.name }}</td>
        <td>{{ users[proof.user]?.firstname }}</td>
        <td>{{ users[proof.user]?.email }}</td>
        <td>{{ new Date(proof.date).toLocaleDateString() }}</td>
        <td>
          <a
            href="#"
            @click.prevent="pdf = proof.filepath"
            style="cursor:pointer;"
          >
            {{ proof.name }}
          </a>
        </td>
        <td>
          <button class="button is-danger is-small mr-2" @click="handleDelete(proof)">
            {{ $t('table.deliverymen.refuse') }}
          </button>
          <button class="button is-success is-small" @click="handleValidate(proof)">
            {{ $t('table.deliverymen.accept') }}
          </button>
        </td>
      </tr>
      <tr v-if="paginatedProofs.length === 0">
        <td colspan="6" class="has-text-centered">{{ $t('table.deliverymen.empty') }}</td>
      </tr>
    </tbody>
  </table>

  
  <Pages
    :pagination="pagination"
    :list="proofs"
    @changePage="changePage"
  />

  
  <VPdfViewer
    v-if="pdf"
    :src="'http://88.172.140.59:52000/data/proofs/' + pdf"
    @close="pdf = null"
    style="margin-top: 2rem;"
  />
</template>
