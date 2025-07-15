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

const pagination = newPagination()
const products   = ref<Product[]>([])
const loading    = ref(false)
const showForm   = ref(false)

interface ProductInput {
  name: string
  price: number
  size: number | null
  location: number | null
}
const form = ref<ProductInput>({ name: '', price: 0, size: null, location: null })

const selectedFile = ref<File | null>(null)
const fileName     = ref('')

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
  console.log('[MyProducts] Current user:', user)
  console.log('[MyProducts] Session token:', session.token)
  
  if (!form.value.name?.trim()) {
    alert('Le nom du produit est requis')
    return
  }
  
  // Temporairement désactivé pour le test
  // if (!selectedFile.value) {
  //   alert('Une image est requise')
  //   return
  // }
  
  // // Vérifier le type de fichier
  // const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  // if (!allowedTypes.includes(selectedFile.value.type)) {
  //   alert('Format d\'image non supporté. Utilisez JPG, PNG ou GIF.')
  //   return
  // }
  
  // // Vérifier la taille du fichier (limite à 5MB)
  // if (selectedFile.value.size > 5 * 1024 * 1024) {
  //   alert('L\'image est trop volumineuse. Limite: 5MB')
  //   return
  // }
  if (form.value.price <= 0) {
    alert('Le prix doit être supérieur à 0')
    return
  }
  
  try {
    console.log('[MyProducts] Creating product with data:', {
      name: form.value.name.trim(),
      price: form.value.price,
      size: form.value.size,
      location: form.value.location,
      imageSize: selectedFile.value?.size,
      imageType: selectedFile.value?.type
    })
    
    // TEST 1: Essayons d'abord avec un simple objet JSON
    const productData = {
      name: form.value.name.trim(),
      price: form.value.price,
      description: 'Produit créé depuis l\'interface',
      // Ajoutons des champs qui pourraient être requis
      size: form.value.size || 1,
      location: form.value.location || 1
    }
    
    console.log('[MyProducts] JSON data prepared, calling API...')
    
    // Test préliminaire : vérifier si l'endpoint existe
    try {
      const testResponse = await fetch(`http://88.172.140.59:52000/api/products`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      })
      console.log('[MyProducts] GET test response:', testResponse.status)
    } catch (e) {
      console.error('[MyProducts] GET test error:', e)
    }
    
    // Testons d'abord en appelant directement l'API sans passer par createProduct
    const response = await fetch(`http://88.172.140.59:52000/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`
      },
      body: JSON.stringify(productData)
    })
    
    console.log('[MyProducts] Response status:', response.status)
    console.log('[MyProducts] Response headers:', response.headers)
    
    let responseData
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json()
    } else {
      responseData = await response.text()
    }
    
    console.log('[MyProducts] Response data:', responseData)
    console.log('[MyProducts] Response content-type:', contentType)
    
    if (!response.ok) {
      console.error('[MyProducts] Error response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      })
      throw new Error(`HTTP ${response.status}: ${responseData?.message || responseData || 'Erreur inconnue'}`)
    }
    
    const created = normalizeProduct(responseData)
    console.log('[MyProducts] Product created successfully:', created)
    
    products.value.unshift(created)
    showForm.value = false
    
    // Réinitialiser le formulaire
    form.value = { name: '', price: 0, size: null, location: null }
    selectedFile.value = null
    fileName.value = ''
  } catch (err: any) {
    console.error('[MyProducts] Error creating product:', err)
    console.error('[MyProducts] Error details:', err.response?.data)
    const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la création du produit'
    alert(errorMessage)
  }
}

onMounted(loadProducts)
</script>

<template>
  <div class="myproduct">
    <h1 class="title has-text-centered mb-4">Mes Produits</h1>

    <div v-if="loading" class="loading">Chargement…</div>

    <div v-else class="cards">
      <ProductCard
        v-for="p in products"
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
