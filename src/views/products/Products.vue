<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getProducts, getSellers } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'
import Pages from '@/components/Pages.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import type { User } from '@/types/user.ts'
import type { Product } from '@/types/product.ts'
import Icon from '@/components/Icon.vue'

const route = useRoute()
const pagination = ref(newPagination())
pagination.value.limit = 10

const allProducts = ref<Product[]>([])

// Filtres
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const selectedSizes = ref<string[]>([])
const sellerInput = ref<string>()
const sellers = ref<User[]>([])
const selectedSellers = ref<User[]>([])
const search = ref('')

// Initialiser la recherche avec le paramètre d'URL
if (route.query.filter) {
  search.value = String(route.query.filter)
}

const sizes = ['small', 'medium', 'large', 'xxl']

// Charger tous les produits une seule fois
async function loadProducts () {
  const data = await getProducts(pagination.value)
  allProducts.value = data
}
loadProducts()

// Recherche vendeur
function searchSellers() {
  if (!sellerInput.value || sellerInput.value.length < 3) return
  getSellers(sellerInput.value).then(data => {
    sellers.value = data.filter(user => !selectedSellers.value.some(selected => selected._id === user._id))
  })
}

function selectSeller(seller: User) {
  selectedSellers.value.push(seller)
  sellerInput.value = ''
  sellers.value = []
}

// Checkbox tailles
function toggleSize(size: string) {
  const idx = selectedSizes.value.indexOf(size)
  if (idx === -1) selectedSizes.value.push(size)
  else selectedSizes.value.splice(idx, 1)
}

// Barre de recherche
function onSearch() {
  pagination.value.page = 0
}

// Liste filtrée complète
const filteredProductsAll = computed(() => {
  let filtered = [...allProducts.value]
  if (priceMin.value !== null && priceMin.value !== undefined) filtered = filtered.filter(p => p.price >= (priceMin.value as number))
  if (priceMax.value !== null && priceMax.value !== undefined) filtered = filtered.filter(p => p.price <= (priceMax.value as number))
  if (selectedSizes.value.length) filtered = filtered.filter(p => p.size && selectedSizes.value.includes(p.size.name))
  if (selectedSellers.value.length) filtered = filtered.filter(p => p.seller && selectedSellers.value.some(s => s._id === p.seller._id))
  if (search.value.trim()) {
    const term = search.value.trim().toLowerCase()
    filtered = filtered.filter(p => p.name?.toLowerCase().includes(term))
  }
  return filtered
})

// Liste paginée à afficher
const paginatedProducts = computed(() => {
  const start = pagination.value.page * pagination.value.limit
  const end = start + pagination.value.limit
  return filteredProductsAll.value.slice(start, end)
})

// Changement de page
function onPageChange(page: number) {
  pagination.value.page = page
}
</script>

<template>
  <div class="columns is-fullwidth is-fullheight">
    <nav class="box ml-3 mt-5">
      <div>
        <label class="title is-5">{{ $t('product.price.name') }}</label>
        <div class="control has-icons-right my-3">
          <input v-model.number="priceMin" class="input" type="number" :placeholder="$t('product.price.min')" min="0" />
          <span class="icon is-small is-right">€</span>
        </div>
        <div class="control has-icons-right">
          <input v-model.number="priceMax" class="input" type="number" :placeholder="$t('product.price.max')" min="0"/>
          <span class="icon is-small is-right">€</span>
        </div>
      </div>

      <div class="my-6">
        <label class="title is-5">{{ $t('product.size.name') }}</label>
        <div class="checkboxes is-flex-direction-column mt-3">
          <label v-for="size in sizes" class="checkbox">
            <input type="checkbox" :value="size" :checked="selectedSizes.includes(size)" @change="toggleSize(size)" />
            {{ $t('product.size.' + size) }}
          </label>
        </div>
      </div>

      <div class="content mb-5">
        <label class="title is-5">{{ $t('product.seller') }}</label>

        <div :class="'dropdown' + (sellerInput && sellers.length ? ' is-active' : '')">
          <div class="dropdown-trigger">
            <div class="control has-icons-left mt-3">
              <input v-model="sellerInput" class="input" type="text" placeholder="Search" @keyup="searchSellers">
              <span class="icon is-left">
                <i class="fas fa-search" aria-hidden="true"></i>
              </span>
            </div>
          </div>
          <div class="dropdown-menu">
            <div class="dropdown-content">
              <a class="dropdown-item" v-for="seller in sellers" @click="selectSeller(seller)" :key="seller._id">
                {{ seller.firstname + " " + seller.name }}
              </a>
            </div>
          </div>
        </div>

        <ul v-for="(seller, i) in selectedSellers" :key="seller._id">
          <li>
            {{ seller.firstname + " " + seller.name }}
            <Icon icon="fa-trash" @click="selectedSellers.splice(i, 1)" />
          </li>
        </ul>
      </div>

      <!-- Barre de recherche -->
      <div class="field mb-4" style="max-width:400px;">
        <div class="control has-icons-right">
          <input
            v-model="search"
            class="input"
            type="text"
            placeholder="Rechercher un produit…"
          />
          <span class="icon is-small is-right">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </div>

      <button class="button is-primary mt-4" @click="onSearch">Rechercher</button>
    </nav>

    <div class="my-5 is-fullwidth is-flex is-flex-direction-column">
      <div class="is-fullheight">
        <h1 class="title has-text-centered">
          {{ search ? $t("search.results", { input: search }) : $t("product.products") }}
        </h1>
        <div class="is-flex is-flex-wrap-wrap is-justify-content-center">
          <ProductCard
            class="mx-5"
            v-for="product in paginatedProducts"
            :key="product._id"
            :product="product"
          />
        </div>
      </div>
      <Pages
        class="mb-auto"
        :list="filteredProductsAll"
        :pagination="pagination"
        @changePage="onPageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.is-fullheight {
  height: 100%;
}
.is-fullwidth {
  width: 100%;
}
</style>
