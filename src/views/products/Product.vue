<script setup lang="ts">
import { startSession } from '@/stores/session'
import {
    api,
    buyProduct, getImageURL,
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

const session = startSession()
api(session)


const loggedIn = ref(false)
isSessionValid(false).then((valid: boolean) => (loggedIn.value = valid))


const product = ref<Product | undefined>()
loadPage(product, getProduct)

const location = ref<Location | undefined>()
const locations = ref<Location[]>([])
getLocations().then((locs) => (locations.value = locs))

getLocations().then((locs) => (locations.value = locs))


const buyModal = ref(false)
async function toggleBuyModal() {
  if (loggedIn.value) {
    buyModal.value = !buyModal.value
    return
  }
  router.push('/login')
}


async function submit() {
  if (!location.value) return
  if (!!location.value._id) {
    saveLocation(location.value).then((loc) => {
      location.value = loc
      buy()
    })
  } else buy()
}


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

      <figure class="image is-1by1 is-fullwidth mr-5 mt-5">
        <img
          :alt="product.name"
          :src="product.image ? getImageURL(product.image) : 'https://bulma.io/assets/images/placeholders/256x256.png'"
        />
      </figure>


      <div>
        <h1 class="title">{{ product.name }}</h1>

        <div v-if="product.seller">
          {{ $t('product.seller') }}:
          <RouterLink class="link" :to="'/profile/' + product.seller._id">
            {{ product.seller.firstname }} {{ product.seller.name }}
          </RouterLink>
        </div>
        <div v-else>
          <em>{{ $t('product.noSeller') || 'Vendeur non spécifié' }}</em>
        </div>

        <p>
          {{ $t('product.price.name') }}: <strong>{{ product.price }} €</strong>
        </p>


        <p v-if="product.size">
          {{ $t('product.size.name') || 'Taille' }}:
          <strong>{{ product.size.name }}</strong>
        </p>


        <div class="mt-3">
          <button class="button is-primary" @click="toggleBuyModal">
            Acheter
          </button>


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
</template>

<style scoped>
.is-1by1 {
  width: 30em;
}
</style>
