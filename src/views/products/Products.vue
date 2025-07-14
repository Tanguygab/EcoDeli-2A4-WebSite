<script setup lang="ts">
import { ref, watch } from 'vue'
import { getProducts, getSellers } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'
import Pages from '@/components/Pages.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import type { User } from '@/types/user.ts'
import type { Product } from '@/types/product.ts'
import Icon from '@/components/Icon.vue'

const pagination = newPagination()
pagination.limit = 10 // Limiter à 10 produits par page

const products = ref<Product[]>([])

const loadProducts = async () => {
  const data = await getProducts(pagination)
  products.value = data
}

// Initial load
loadProducts()

// Recharger les produits quand on change de page
watch(() => pagination.page, () => {
  loadProducts()
})

// Recherche et sélection des vendeurs
const sellerInput = ref<string>()
const sellers = ref<User[]>([])
const selectedSellers = ref<User[]>([])

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

const sizes = ['small', 'medium', 'large', 'xxl']
</script>

<template>
  <div class="columns is-fullwidth is-fullheight">
    <!-- FILTRES -->
    <nav class="box ml-3 mt-5">
      <div>
        <label class="title is-5">{{ $t('product.price.name') }}</label>
        <div class="control has-icons-right my-3">
          <input class="input" type="number" :placeholder="$t('product.price.min')" min="0" />
          <span class="icon is-small is-right">€</span>
        </div>
        <div class="control has-icons-right">
          <input class="input" type="number" :placeholder="$t('product.price.max')" min="0"/>
          <span class="icon is-small is-right">€</span>
        </div>
      </div>

      <div class="my-6">
        <label class="title is-5">{{ $t('product.size.name') }}</label>
        <div class="checkboxes is-flex-direction-column mt-3">
          <label v-for="size in sizes" class="checkbox">
            <input type="checkbox" />
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
    </nav>

    <div class="my-5 is-fullwidth is-flex is-flex-direction-column">
      <div class="is-fullheight">
        <h1 class="title has-text-centered">
          {{ pagination.filter ? $t("search.results", { input: pagination.filter }) : $t("product.products") }}
        </h1>
        <div class="is-flex is-flex-wrap-wrap is-justify-content-center">
          <ProductCard
            class="mx-5"
            v-for="product in products"
            :key="product._id"
            :product="product"
          />
        </div>
      </div>

    
      <Pages class="mb-auto" :list="products" :pagination="pagination" />
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
