<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { startSession } from '@/stores/session'
import { api, getClientAnnonces, createClientAnnonce, deleteClientAnnonce } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'


const session = startSession()
api(session)
const user = session.user

const pagination = newPagination()
// Référence pour les annonces
const annonces = ref<any[]>([])
const loading = ref(false)
const showForm = ref(false)
const search = ref('')

const form = ref({
  title: '',
  description: '',
  date: '',
  location: ''
})

async function loadAnnonces() {
  loading.value = true
  try {
    console.log('🔍 Chargement des annonces...')
    
    // Utilisation de l'API uniquement
    try {
      annonces.value = await getClientAnnonces(pagination)
      console.log('✅ Annonces chargées via API:', annonces.value)
    } catch (apiError: any) {
      console.error('❌ Erreur API:', apiError)
      throw new Error('Impossible de charger les annonces depuis l\'API')
    }
  } catch (e: any) {
    console.error('❌ Erreur lors du chargement des annonces:', e)
    annonces.value = []
    alert('Erreur: Impossible de charger les annonces. Vérifiez votre connexion.')
  } finally {
    loading.value = false
  }
}

function openForm() {
  form.value = { title: '', description: '', date: '', location: '' }
  showForm.value = true
}

async function submitForm() {
  // Validation côté frontend
  if (!form.value.title?.trim() || !form.value.description?.trim()) {
    alert('Titre et description requis')
    return
  }
  
  try {
    console.log('🚀 Tentative de création d\'annonce:', form.value)
    
    // Préparer les données pour l'API
    const annonceData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      date: form.value.date || '',
      location: form.value.location?.trim() || ''
    }
    
    console.log('📦 Données envoyées à l\'API:', annonceData)
    
    // Création via l'API uniquement
    const result = await createClientAnnonce(annonceData)
    console.log('✅ Annonce créée avec succès:', result)
    
    // Recharger les annonces et fermer le formulaire
    await loadAnnonces()
    showForm.value = false
    alert('Annonce créée avec succès et sauvegardée sur le serveur !')
    
  } catch (error: any) {
    console.error('❌ Erreur lors de la création:', error)
    alert('Erreur: Impossible de créer l\'annonce. ' + (error.message || 'Vérifiez votre connexion et réessayez.'))
  }
}

async function deleteAnnonce(id: string) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
    return
  }
  
  try {
    console.log('🗑️ Tentative de suppression de l\'annonce:', id)
    
    // Suppression via l'API uniquement
    await deleteClientAnnonce(id)
    console.log('✅ Annonce supprimée avec succès')
    
    // Recharger les annonces
    await loadAnnonces()
    alert('Annonce supprimée avec succès du serveur !')
    
  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression:', error)
    alert('Erreur: Impossible de supprimer l\'annonce. ' + (error.message || 'Vérifiez votre connexion et réessayez.'))
  }
}

function filteredAnnonces() {
  if (!search.value.trim()) return annonces.value
  return annonces.value.filter(a =>
    a.title.toLowerCase().includes(search.value.trim().toLowerCase())
  )
}

onMounted(loadAnnonces)
</script>

<template>
  <div class="client-annonces">
    <!-- Header moderne -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          {{ $t('client.annonces.title') }}
        </h1>
        <p class="page-subtitle">Gérez vos annonces et créez-en de nouvelles</p>
      </div>
    </div>

    <!-- Barre de recherche améliorée -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            v-model="search"
            class="search-input"
            type="text"
            :placeholder="$t('client.annonces.search')"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <button class="create-btn" @click="openForm">
          <i class="fas fa-plus"></i>
          <span>{{ $t('client.annonces.add') }}</span>
        </button>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="main-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des annonces...</p>
      </div>

      <div v-else-if="annonces.length === 0" class="empty-state">
        <h3>Aucune annonce pour le moment</h3>
        <p>Créez votre première annonce pour commencer</p>
      </div>

      <div v-else class="annonces-grid">
        <div v-for="a in filteredAnnonces()" :key="a._id" class="annonce-card">
          <div class="card-header">
            <h3 class="card-title">{{ a.title }}</h3>
            <div class="card-actions">
              <button class="action-btn edit-btn" title="Modifier">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-btn" @click="deleteAnnonce(a._id)" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="card-content">
            <p class="card-description">{{ a.description }}</p>
          </div>
          <div class="card-footer">
            <div class="card-meta">
              <span v-if="a.date" class="meta-item">
                <i class="fas fa-calendar"></i>
                {{ new Date(a.date).toLocaleDateString() }}
              </span>
              <span v-if="a.location && a.location !== 'Non spécifié'" class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                {{ a.location }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal amélioré -->
    <div v-if="showForm" class="modal-overlay" @click="showForm = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            {{ $t('client.annonces.add') }}
          </h2>
          <button class="modal-close" @click="showForm = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="submitForm" class="modal-body">
          <div class="form-group">
            <label class="form-label">{{ $t('client.annonces.form.title') }} *</label>
            <input 
              v-model="form.title" 
              class="form-input" 
              type="text" 
              placeholder="Titre de votre annonce"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">{{ $t('client.annonces.form.description') }} *</label>
            <textarea 
              v-model="form.description" 
              class="form-textarea" 
              placeholder="Description détaillée de votre annonce"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ $t('client.annonces.form.date') }} (optionnel)</label>
              <input 
                v-model="form.date" 
                class="form-input" 
                type="date"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">{{ $t('client.annonces.form.location') }} (optionnel)</label>
              <input 
                v-model="form.location" 
                class="form-input" 
                type="text" 
                placeholder="Lieu"
              />
            </div>
          </div>
        </form>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showForm = false">
            <i class="fas fa-times"></i>
            Annuler
          </button>
          <button class="btn btn-primary" @click="submitForm">
            <i class="fas fa-check"></i>
            {{ $t('client.annonces.form.submit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.client-annonces {
  min-height: 100vh;
  background: #2A2A2A;
  color: #fff;
  padding: 0;
  width: 100%;
}


.page-header {
  background: #2A2A2A;
  padding: 2rem 0;
  border-bottom: 1px solid #333;
  width: 100%;
}

.header-content {
  width: 100%;
  padding: 0 2rem;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title i {
  color: #09ce44;
}

.page-subtitle {
  color: #ccc;
  font-size: 1.1rem;
  margin: 0;
}


.search-section {
  padding: 2rem 0;
  background: #2A2A2A;
  width: 100%;
}

.search-container {
  width: 100%;
  padding: 0 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #333;
  border-radius: 25px;
  background: #333;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  background: #444;
  border-color: #09ce44;
  box-shadow: 0 0 0 3px rgba(9, 206, 68, 0.3);
}

.search-input::placeholder {
  color: #aaa;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #09ce44;
  font-size: 1.1rem;
}

.create-btn {
  background: #09ce44;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.create-btn:hover {
  background: #0ab33a;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(9, 206, 68, 0.3);
}

/* Main Content */
.main-content {
  width: 100%;
  padding: 0 2rem 2rem;
  background: #2A2A2A;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 0;
  color: #fff;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #333;
  border-top: 4px solid #09ce44;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: #fff;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.empty-state p {
  color: #ccc;
  margin-bottom: 2rem;
}

/* Annonces Grid */
.annonces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  width: 100%;
}

.annonce-card {
  background: #2A2A2A;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  border: 1px solid #444;
}

.annonce-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
  border-color: #09ce44;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #444;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  flex: 1;
  margin-right: 1rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-btn {
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.edit-btn {
  background: #09ce44;
  color: #fff;
}

.edit-btn:hover {
  background: #0ab33a;
  transform: scale(1.1);
}

.delete-btn {
  background: #d33;
  color: #fff;
}

.delete-btn:hover {
  background: #b22;
  transform: scale(1.1);
}

.card-content {
  padding: 1rem 1.5rem;
}

.card-description {
  color: #ccc;
  line-height: 1.6;
  margin: 0;
}

.card-footer {
  padding: 1rem 1.5rem;
  background: #2a2a2a;
  border-top: 1px solid #444;
}

.card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #aaa;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item i {
  color: #09ce44;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-container {
  background: #2A2A2A;
  color: #fff;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  animation: modalSlideIn 0.3s ease;
  border: 1px solid #444;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #444;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
}

.modal-title i {
  color: #09ce44;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: #444;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #555;
  transform: scale(1.1);
}

.modal-body {
  padding: 2rem;
  max-height: 400px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #fff;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #444;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #2a2a2a;
  color: #fff;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #09ce44;
  box-shadow: 0 0 0 3px rgba(9, 206, 68, 0.3);
  background: #333;
}

.form-input::placeholder, .form-textarea::placeholder {
  color: #aaa;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #444;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #555;
  color: #fff;
}

.btn-secondary:hover {
  background: #666;
  transform: translateY(-1px);
}

.btn-primary {
  background: #09ce44;
  color: #fff;
}

.btn-primary:hover {
  background: #0ab33a;
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(9, 206, 68, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .search-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-input-wrapper {
    max-width: none;
  }
  
  .annonces-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-container {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .card-header {
    padding: 1rem;
  }
  
  .card-content,
  .card-footer {
    padding: 1rem;
  }
  
  .main-content {
    padding: 0 1rem 1rem;
  }
  
  .header-content,
  .search-container {
    padding: 0 1rem;
  }
}
</style>