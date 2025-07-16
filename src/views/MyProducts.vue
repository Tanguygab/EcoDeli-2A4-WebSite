<script setup lang="ts">
import { ref } from 'vue'
import { startSession } from '@/stores/session'
import { api, createProduct, getProducts, saveLocation, getUserProducts } from '@/api.ts'
import ProductCard from '@/components/products/ProductCard.vue'
import type { Product } from '@/types/product'
import type { Location } from '@/types/location.ts'
import LocationSelector from '@/components/location/LocationSelector.vue'
import { newPagination } from '@/types/pagination.ts'

const pagination = newPagination()

// Initialisation de la session et de l'API
const session = startSession()
api(session)
const user = session.user!!

const products = ref<Product[]>([])

getUserProducts(user?._id?.toString()).then(data => {
    if (!user) {
        products.value = []
        return
    }
    products.value = data.filter(p => {
        // Cas 1 : le champ seller existe et correspond à l'utilisateur
        if (p.seller) {
            if (typeof p.seller === 'object' && String(p.seller._id) === String(user._id)) return true
            if (typeof p.seller === 'string' && String(p.seller) === String(user._id)) return true
        }
        // Cas 2 : le champ location existe et location.user correspond à l'utilisateur
        if (p.location && p.location.user) {
            if (typeof p.location.user === 'object' && String(p.location.user._id) === String(user._id)) return true
            if (typeof p.location.user === 'string' && String(p.location.user) === String(user._id)) return true
        }
        // Sinon, ne pas afficher
        return false
    })
    console.log('[MyProducts] Produits affichés :', products.value)
})
const loading = ref(false)
const showForm = ref(false)

const location = ref<Location>()
const form = ref<HTMLFormElement>()

const selectedFile = ref<File | null>(null)
const fileName = ref('')

function openForm() {
    selectedFile.value = null
    fileName.value = ''
    showForm.value = true
}

function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement
    if (!input.files?.length) return
    selectedFile.value = input.files[0]
    fileName.value = selectedFile.value.name
}

async function getLocation() {
    if (!location.value) return null
    return location.value._id !== null
        ? location.value
        : await saveLocation(location.value)
}

async function submitForm() {
    console.log('[MyProducts] Current user:', user)
    console.log('[MyProducts] Session token:', session.token)

    const formData = new FormData(form.value)

    if (!formData.get("name")?.toString().trim()) {
        alert('Le nom du produit est requis')
        return
    }

    if (!selectedFile.value) {
        console.warn('[MyProducts] No image selected, proceeding without image for testing')
    } else {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if (!allowedTypes.includes(selectedFile.value.type)) {
            alert("Format d'image non supporté. Utilisez JPG, PNG ou GIF.")
            return
        }

        if (selectedFile.value.size > 5 * 1024 * 1024) {
            alert("L'image est trop volumineuse. Limite: 5MB")
            return
        }
    }

    if (Number(formData.get("price")) <= 0) {
        alert('Le prix doit être supérieur à 0')
        return
    }

    const location = await getLocation()
    if (!location) {
        alert('Le lieu est requis')
        return
    }
    formData.set("location", location._id + "")

    try {
        console.log('[MyProducts] Creating product with data:', formData)

        console.log('[MyProducts] JSON data prepared, calling API...')

        const created = await createProduct(formData)
        console.log('[MyProducts] Product created successfully:', created)

        products.value.unshift(created)
        showForm.value = false

        selectedFile.value = null
        fileName.value = ''

        alert('Produit créé avec succès ! Une notification a été envoyée.')
    } catch (err: any) {
        console.error('[MyProducts] Error creating product:', err)
        console.error('[MyProducts] Error details:', err.response?.data)
        const errorMessage =
            err.response?.data?.message || err.message || 'Erreur lors de la création du produit'
        alert(errorMessage)
    }
}
</script>

<template>
    <div class="myproduct">
        <h1 class="title has-text-centered mb-4">Mes Produits</h1>

        <div v-if="loading" class="loading">Chargement…</div>

        <div v-else class="cards">
            <ProductCard v-for="p in products" :key="p._id" :product="p" />
            <div style="flex: 0 0 200px" />
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
                <form ref="form" class="modal-card-body" @submit.prevent="submitForm" enctype="multipart/form-data">
                    <div class="field">
                        <label class="label">Nom</label>
                        <input name="name" class="input" type="text" />
                    </div>
                    <div class="field">
                        <label class="label">Image</label>
                        <div class="file is-boxed is-success has-name is-fullwidth">
                            <label class="file-label">
                                <input
                                    class="file-input"
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    @change="handleFileChange"
                                />
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
                        <input name="price" class="input" type="number" min="0" />
                    </div>
                    <div class="field">
                        <label class="label"
                            >Poids <span class="has-text-grey">(sélectionner)</span></label
                        >
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select name="size" required>
                                    <option disabled value="">-- Choisissez le poids --</option>
                                    <option :value="1">small</option>
                                    <option :value="2">medium</option>
                                    <option :value="3">large</option>
                                    <option :value="4">xxl</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">
                            Lieu <span class="has-text-grey">(sélectionner)</span>
                        </label>
                        <LocationSelector v-model="location" />
                    </div>
                </form>
                <footer class="modal-card-foot">
                    <input @click="submitForm" type="submit" class="button is-success" value="Enregistrer">
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
.loading {
    text-align: center;
    padding: 2rem;
}
.add-btn {
    margin: 2rem auto 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}
</style>
