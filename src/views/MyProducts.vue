<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startSession } from '@/stores/session'
import { getProducts, createProduct } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'
import ProductCard from '@/components/products/ProductCard.vue'
import Icon from '@/components/Icon.vue'
import type { Product } from '@/types/product'

const session = startSession()
const user = session.user!!

// Pagination
const pagination = newPagination()

// Produits de l'utilisateur
const products = ref<Product[]>([])
const loading = ref(false)

async function loadProducts() {
  loading.value = true
  try {
    const list = await getProducts(pagination)
    products.value = list.filter(p => {
      if (!p.seller) return false
      return typeof p.seller === 'number' ? p.seller === user._id : p.seller._id === user._id
    })
  } finally { loading.value = false }
}

// ---------- Formulaire ----------
const showForm = ref(false)
interface ProductInput {
  name: string
  price: number
  size: number | null
  location: number | null
  seller: number
}
const form = ref<ProductInput>({ name: '', price: 0, size: null, location: null, seller: user._id })

const selectedFile = ref<File | null>(null)
const fileName = ref('')
function openForm() {
  form.value = { name: '', price: 0, size: null, location: null, seller: user._id }
  selectedFile.value = null
  fileName.value = ''
  showForm.value = true
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return
  selectedFile.value = input.files[0]
  fileName.value = selectedFile.value.name
}

async function submitForm() {
  if (!form.value.name || !selectedFile.value) {
    alert('Nom et image requis')
    return
  }
  try {
    const data = new FormData()
    data.append('name', form.value.name)
    data.append('price', form.value.price.toString())
    if (form.value.size !== null) data.append('size', form.value.size.toString())
    if (form.value.location !== null) data.append('location', form.value.location.toString())
    data.append('seller', form.value.seller.toString())
    data.append('image', selectedFile.value)

    const created: Product = await createProduct(data as any)
    // Ajout immédiat à la liste sans rechargement de page
    products.value.unshift(created)
    showForm.value = false
  } catch (err: any) {
    alert(err.response?.data?.message || 'Erreur lors de la création du produit')
  }
}

onMounted(loadProducts)
</script>

<template>
  <div class="myproduct">
    <h1 class="title has-text-centered">Mes Produits</h1>

    <div v-if="loading" class="loading">Chargement…</div>

    <div v-else class="cards">
      <ProductCard v-for="p in products" :key="p._id" :product="p">
        <template #footer>
          <button class="button is-small is-info" disabled><Icon icon="fa-edit" /></button>
          <button class="button is-small is-danger" disabled><Icon icon="fa-trash" /></button>
        </template>
      </ProductCard>
    </div>

    <!-- Bouton flottant d'ajout -->
    <button class="button is-primary add-btn" @click="openForm">
      <Icon icon="fa-plus" />
    </button>

    <!-- Modal -->
    <div v-if="showForm" class="modal is-active">
      <div class="modal-background" @click="showForm = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Nouveau produit</p>
          <button class="delete" @click="showForm = false"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Nom</label>
            <input v-model="form.name" class="input" type="text" />
          </div>
          <div class="field">
            <label class="label">Image</label>
            <div class="file is-centered is-boxed is-success has-name">
              <label class="file-label">
                <input class="file-input" type="file" accept="image/*" @change="handleFileChange" />
                <span class="file-cta">
                  <span class="file-icon"><i class="fas fa-upload"></i></span>
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
          <div class="field">
            <label class="label">Taille (ID)</label>
            <input v-model.number="form.size" class="input" type="number" min="1" />
          </div>
          <div class="field">
            <label class="label">Lieu (ID)</label>
            <input v-model.number="form.location" class="input" type="number" min="1" />
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
.cards { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; }
.loading { text-align: center; padding: 2rem; }
.add-btn { position: fixed; bottom: 2rem; right: 2rem; border-radius: 50%; width: 3.5rem; height: 3.5rem; display: flex; align-items: center; justify-content: center; }
</style>