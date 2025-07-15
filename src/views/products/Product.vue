<script setup lang="ts">
import { startSession } from '@/stores/session'
import {
  api,
  buyProduct,
  getLocations,
  getProduct,
  isSessionValid,
  loadPage,
  saveLocation
} from '@/api'
import { ref } from 'vue'
import type { Product } from '@/types/product'
import Modal from '@/components/Modal.vue'
import type { Location } from '@/types/location'
import router from '@/router'
import LocationSelector from '@/components/location/LocationSelector.vue'
import LabelInput from '@/components/LabelInput.vue'
import { computed } from 'vue'

// Auth & API Setup
const session = startSession()
api(session)

// Vérifier si utilisateur connecté
const loggedIn = ref(false)
isSessionValid(false).then((valid: boolean) => (loggedIn.value = valid))

// Produit à afficher
const product = ref<Product | undefined>()
loadPage(product, getProduct)
// Liste des lieux pour sélection
const location = ref<Location | undefined>()
const locations = ref<Location[]>([])
getLocations().then((locs) => (locations.value = locs))

// Dummy filteredProducts function (replace with your actual filter logic)
const filteredProducts = computed<Product[]>(() => {
  // If you have a products array, filter it here. For now, return an empty array.
  return []
})
getLocations().then((locs) => (locations.value = locs))

// Modal d'achat
const buyModal = ref(false)
async function toggleBuyModal() {
  if (loggedIn.value) {
    buyModal.value = !buyModal.value
    return
  }
  router.push('/login')
}

// Soumission achat
async function submit() {
  if (!location.value) return
  if (!!location.value._id) {
    saveLocation(location.value).then((loc) => {
      location.value = loc
      buy()
    })
  } else buy()
}

// Achat
const amount = ref(1)
async function buy() {
  if (product.value && location.value) {
    buyProduct(product.value, amount.value, location.value).then((p) => {
      router.push({ path: '/requests/' + p._id })
    })
  }
}
</script>

<template>
  <template v-if="product">
    <div class="is-flex">
      <!-- Image du produit -->
      <figure class="image is-1by1 is-fullwidth mr-5 mt-5">
        <img
          :alt="product.name"
          src="https://bulma.io/assets/images/placeholders/256x256.png"
        />
      </figure>

      <!-- Détails produit -->
      <div>
        <h1 class="title">{{ product.name }}</h1>

        <!-- Vendeur -->
        <div v-if="product.seller">
          {{ $t('product.seller') }}:
          <RouterLink class="link" :to="'/profile/' + product.seller._id">
            {{ product.seller.firstname }} {{ product.seller.name }}
          </RouterLink>
        </div>
        <div v-else>
          <em>{{ $t('product.noSeller') || 'Vendeur non spécifié' }}</em>
        </div>

        <!-- Prix -->
        <p>
          {{ $t('product.price.name') }}: <strong>{{ product.price }} €</strong>
        </p>

        <!-- Taille -->
        <p v-if="product.size">
          {{ $t('product.size.name') || 'Taille' }}:
          <strong>{{ product.size.name }}</strong>
        </p>

        <!-- Bouton acheter -->
        <div class="mt-3">
          <button class="button is-primary" @click="toggleBuyModal">
            Acheter
          </button>

          <!-- Modal d'achat -->
          <Modal
            :active="buyModal"
            title="Acheter"
            :buttons="{ 'global.confirm': 'primary' }"
            :cancel="true"
            @confirm="submit"
            @close="toggleBuyModal"
          >
            <LabelInput
              v-model="amount"
              :label="$t('product.amount') || 'Quantité'"
              type="number"
              min="1"
            />

            <LocationSelector v-model="location" />

            <br />
            <h5 class="title is-5">
              {{ $t('global.total') || 'Total' }} :
              <strong>{{ product.price * amount }} €</strong>
            </h5>
          </Modal>
        </div>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="has-text-centered mt-5">
      <p>Chargement du produit...</p>
    </div>
  </template>

  <ProductCard
    v-for="product in filteredProducts"
    :key="product._id"
    :product="product"
  />
</template>

<style scoped>
.is-1by1 {
  width: 30em;
}
</style>
