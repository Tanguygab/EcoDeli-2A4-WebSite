<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startSession } from '@/stores/session'
import { api, getProducts, createProduct } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'
import ProductCard from '@/components/products/ProductCard.vue'
import Icon from '@/components/Icon.vue'
import type { Product } from '@/types/product'

// Initialisation de la session et de l'API
const session = startSession()
api(session)
const user = session.user!!

/* -------------------------------------------
 * STATE & PAGINATION
 * -----------------------------------------*/
const pagination = newPagination()
const products   = ref<Product[]>([])
const loading    = ref(false)
const showForm   = ref(false)
const search = ref('')

interface ProductInput {
  name: string
  price: number
  size: number | null
  location: number | null
}
const form = ref<ProductInput>({ name: '', price: 0, size: null, location: null })

const selectedFile = ref<File | null>(null)
const fileName     = ref('')

/* -------------------------------------------
 * NORMALISATION DES CHAMPS RELATIONNELS
 * -----------------------------------------*/
function normalizeProduct(raw: Product): Product {
  const p: any = { ...raw }
  if (!p.seller || typeof p.seller === 'number') {
    p.seller = {
      _id: typeof p.seller === 'number' ? p.seller : 0,
      firstname: '',
      name: ''
    }
  }
  if (!p.size || typeof p.size === 'number') {
    p.size = { _id: typeof p.size === 'number' ? p.size : 0, name: '' }
  }
  if (!p.location || typeof p.location === 'number') {
    p.location = { _id: typeof p.location === 'number' ? p.location : 0, name: '' }
  }
  return p as Product
}

/* -------------------------------------------
 * CHARGEMENT DES PRODUITS DU VENDEUR
 * -----------------------------------------*/
async function loadProducts () {
  loading.value = true
  try {
    const list = await getProducts(pagination)
    products.value = list
      .filter(p => p.seller && (typeof p.seller === 'number' ? p.seller === user._id : p.seller._id === user._id))
      .map(normalizeProduct)
  } catch (e) {
    console.error(e)
    alert('Erreur lors du chargement des produits')
  } finally {
    loading.value = false
  }
}

/* -------------------------------------------
 * FORMULAIRES
 * -----------------------------------------*/
function openForm () {
  form.value = { name: '', price: 0, size: null, location: null }
  selectedFile.value = null
  fileName.value     = ''
  showForm.value     = true
}

function handleFileChange (e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.length) return
  selectedFile.value = input.files[0]
  fileName.value     = selectedFile.value.name
}

async function submitForm () {
  if (!form.value.name || !selectedFile.value) {
    alert('Nom et image requis')
    return
  }
  try {
    const data = new FormData()
    data.append('name',  form.value.name)
    data.append('price', form.value.price.toString())
    if (form.value.size      !== null) data.append('size',      form.value.size.toString())
    if (form.value.location  !== null) data.append('location',  form.value.location.toString())
    data.append('image', selectedFile.value)

    const created = normalizeProduct(await createProduct(data))
    products.value.unshift(created)
    showForm.value = false
  } catch (err: any) {
    console.error(err)
    alert(err.response?.data?.message || 'Création impossible')
  }
}

function filteredProducts() {
  if (!search.value.trim()) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.trim().toLowerCase())
  )
}

onMounted(loadProducts)
</script>

<template>
  <div class="myproduct">
    <h1 class="title has-text-centered mb-4">Mes Produits</h1>

    <!-- Barre de recherche -->
    <div class="field mb-4" style="max-width:400px;margin:auto;">
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

    <div v-if="loading" class="loading">Chargement…</div>

    <div v-else class="cards">
      <ProductCard
        v-for="p in filteredProducts()"
        :key="p._id"
        :product="p"
      />
      <div style="flex:0 0 200px" />
    </div>

    <!-- Bouton ajout -->
    <button class="button is-link is-rounded is-medium add-btn" type="button" @click="openForm">
      <span class="icon"><i class="fas fa-plus" /></span>
      <span>Ajouter un produit</span>
    </button>

    <!-- Modal formulaire -->
    <div v-if="showForm" class="modal is-active">
      <div class="modal-background" @click="showForm = false" />
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Nouveau produit</p>
          <button class="delete" @click="showForm = false" />
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Nom</label>
            <input v-model="form.name" class="input" type="text" />
          </div>
          <div class="field">
            <label class="label">Image</label>
            <div class="file is-boxed is-success has-name is-fullwidth">
              <label class="file-label">
                <input class="file-input" type="file" accept="image/*" @change="handleFileChange" />
                <span class="file-cta">
                  <span class="file-icon"><i class="fas fa-upload" /></span>
                  <span class="file-label">Choisir un fichier…</span>
                </span>
                <span class="file-name">{{ fileName || 'Aucun fichier' }}</span>
              </label>
            </div>
          </div>
          <div class="field">
            <label class="label">Prix (€)</label>
            <input v-model.number="form.price" class="input" type="number" min="0" />
          </div>
          <div class="field is-flex gap">
            <div class="mr-2" style="flex:1">
              <label class="label">Taille (ID)</label>
              <input v-model.number="form.size" class="input" type="number" min="1" />
            </div>
            <div style="flex:1">
              <label class="label">Lieu (ID)</label>
              <input v-model.number="form.location" class="input" type="number" min="1" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="submitForm">Enregistrer</button>
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
