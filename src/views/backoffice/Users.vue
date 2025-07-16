<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { startSession } from '@/stores/session'
import { searchUsers, updateUser, deleteUser, banUser, unbanUser, updateUserRole } from '@/api'
import type { User } from '@/types/user'
import type { Pagination } from '@/types/pagination'
import { newPagination } from '@/types/pagination'

const router = useRouter()
const session = startSession()

// Vérification de sécurité supplémentaire
if (!session.user || session.user.role.access_level !== 0) {
  alert('Accès refusé : vous devez être administrateur pour accéder à cette page.')
  router.push('/')
}

const users = ref<User[]>([])
const loading = ref(false)
const search = ref('')
const pagination = newPagination()
const allUsers = ref<User[]>([]) // Cache de tous les utilisateurs
let searchTimeout: number | null = null

const showEditModal = ref(false)
const editingUser = ref<User | null>(null)
const editForm = ref({
  firstname: '',
  name: '',
  email: '',
  description: '',
  role: 0
})

const showDetailsModal = ref(false)
const selectedUser = ref<User | null>(null)

async function loadUsers() {
  loading.value = true
  try {
    // Charger tous les utilisateurs si le cache est vide
    if (allUsers.value.length === 0) {
      const allUsersPagination = { ...pagination, filter: '', page: 0 }
      
      console.log('Chargement de tous les utilisateurs...')
      
      const result: any = await searchUsers(allUsersPagination)
      console.log('Résultat de searchUsers:', result)
      
      if (Array.isArray(result)) {
        allUsers.value = result
      } else if (result && result.data && Array.isArray(result.data)) {
        allUsers.value = result.data
      } else if (result && result.users && Array.isArray(result.users)) {
        allUsers.value = result.users
      } else {
        console.warn('Format de résultat inattendu:', result)
        allUsers.value = []
      }
    }
    
    // Filtrer côté client si une recherche est active
    let filteredUsers = [...allUsers.value]
    
    if (search.value.trim()) {
      const searchTerm = search.value.trim().toLowerCase()
      console.log('Filtrage côté client avec:', searchTerm)
      
      filteredUsers = allUsers.value.filter(user => {
        const fullName = `${user.name} ${user.firstname}`.toLowerCase()
        const email = user.email.toLowerCase()
        const role = user.role?.name?.toLowerCase() || ''
        
        return fullName.includes(searchTerm) || 
               email.includes(searchTerm) || 
               role.includes(searchTerm)
      })
    }
    
    // Trier par nom de famille puis prénom
    users.value = filteredUsers.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase()
      const nameB = (b.name || '').toLowerCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      
      const firstnameA = (a.firstname || '').toLowerCase()
      const firstnameB = (b.firstname || '').toLowerCase()
      if (firstnameA < firstnameB) return -1
      if (firstnameA > firstnameB) return 1
      
      return 0
    })
    
    console.log('Utilisateurs finaux après filtrage:', users.value.length)
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
    users.value = []
  } finally {
    loading.value = false
  }
}

async function handleSearch() {
  // Annuler le timeout précédent s'il existe
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  // Délai de 300ms avant de lancer la recherche
  searchTimeout = setTimeout(async () => {
    console.log('Recherche lancée avec:', search.value)
    await loadUsers()
  }, 300)
}

// Recherche instantanée pour le filtrage local
async function handleInstantSearch() {
  console.log('Recherche instantanée avec:', search.value)
  await loadUsers()
}

// Fonction pour vider la recherche
function clearSearch() {
  search.value = ''
  handleInstantSearch()
}

function openEditModal(user: User) {
  editingUser.value = user
  editForm.value = {
    firstname: user.firstname,
    name: user.name,
    email: user.email,
    description: user.description,
    role: user.role.access_level
  }
  showEditModal.value = true
}

async function saveUser() {
  if (!editingUser.value) return
  
  try {
    const updateData = {
      firstname: editForm.value.firstname,
      name: editForm.value.name,
      email: editForm.value.email,
      description: editForm.value.description
    }
    
    await updateUser(editingUser.value._id, updateData)
    
    // Mettre à jour le rôle séparément si nécessaire
    if (editForm.value.role !== editingUser.value.role.access_level) {
      await updateUserRole(editingUser.value._id, editForm.value.role)
    }
    
    showEditModal.value = false
    // Vider le cache et recharger
    allUsers.value = []
    await loadUsers()
    alert('Utilisateur modifié avec succès')
  } catch (error) {
    console.error('Erreur lors de la modification:', error)
    alert('Erreur lors de la modification de l\'utilisateur')
  }
}

async function handleDeleteUser(user: User) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.name} ${user.firstname} ?`)) {
    return
  }
  
  try {
    await deleteUser(user._id)
    // Vider le cache et recharger
    allUsers.value = []
    await loadUsers()
    alert('Utilisateur supprimé avec succès')
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    alert('Erreur lors de la suppression de l\'utilisateur')
  }
}

async function handleBanUser(user: User) {
  try {
    await banUser(user._id)
    // Vider le cache et recharger
    allUsers.value = []
    await loadUsers()
    alert('Utilisateur banni avec succès')
  } catch (error) {
    console.error('Erreur lors du bannissement:', error)
    alert('Erreur lors du bannissement de l\'utilisateur')
  }
}

async function handleUnbanUser(user: User) {
  try {
    await unbanUser(user._id)
    // Vider le cache et recharger
    allUsers.value = []
    await loadUsers()
    alert('Utilisateur débanni avec succès')
  } catch (error) {
    console.error('Erreur lors du débannissement:', error)
    alert('Erreur lors du débannissement de l\'utilisateur')
  }
}

function openDetailsModal(user: User) {
  selectedUser.value = user
  showDetailsModal.value = true
}

function getStatusText(user: User) {
  if (!user.approved) return 'En attente'
  return 'Approuvé'
}

function getStatusClass(user: User) {
  if (!user.approved) return 'status-pending'
  return 'status-approved'
}

function getRoleName(roleId: number): string {
  const roles = {
    0: 'Admin',
    1: 'Support',
    2: 'HR',
    3: 'Employee',
    4: 'Supplier',
    5: 'Service Provider',
    6: 'Delivery',
    7: 'User'
  }
  return roles[roleId as keyof typeof roles] || 'Unknown'
}

function getRoleClass(roleId: number): string {
  const roleClasses = {
    0: 'role-admin',
    1: 'role-support',
    2: 'role-hr',
    3: 'role-employee',
    4: 'role-supplier',
    5: 'role-service-provider',
    6: 'role-delivery',
    7: 'role-user'
  }
  return roleClasses[roleId as keyof typeof roleClasses] || 'role-default'
}

onMounted(loadUsers)
</script>

<template>
  <div class="users-management">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-users"></i>
        Gestion des Utilisateurs
      </h1>
      <p class="page-subtitle">Gérez les utilisateurs, leurs rôles et permissions</p>
    </div>

    <div class="search-section">
      <div class="container">
        <div class="field has-addons">
          <div class="control is-expanded">
            <input
              v-model="search"
              class="input"
              type="text"
              placeholder="Rechercher un utilisateur..."
              @keyup.enter="handleSearch"
              @input="handleInstantSearch"
            />
          </div>
          <div class="control">
            <button class="button is-success" @click="handleSearch">
              <span class="icon">
                <i class="fas fa-search"></i>
              </span>
              <span>Rechercher</span>
            </button>
          </div>
          <div class="control" v-if="search.length > 0">
            <button class="button is-light" @click="clearSearch">
              <span class="icon">
                <i class="fas fa-times"></i>
              </span>
              <span>Effacer</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div v-if="search.length > 0" class="search-results">
        <p>
          <strong>{{ users.length }}</strong> résultat(s) trouvé(s) pour 
          <em>"{{ search }}"</em>
        </p>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>

      <div v-else-if="users.length === 0" class="empty-state">
        <i class="fas fa-users"></i>
        <h3>Aucun utilisateur trouvé</h3>
        <p v-if="search.length > 0">
          Aucun utilisateur ne correspond à votre recherche "{{ search }}"
        </p>
        <p v-else>
          Aucun utilisateur dans la base de données
        </p>
      </div>

      <div v-else class="users-table">
        <table class="table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Date d'inscription</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id" class="user-row">
              <td class="user-avatar">
                <img v-if="user.image" :src="user.image" :alt="user.firstname" />
                <div v-else class="avatar-placeholder">
                  <i class="fas fa-user"></i>
                </div>
              </td>
              <td class="user-name">
                <div class="name-info">
                  <span class="full-name">{{ user.name }} {{ user.firstname }}</span>
                  <span class="user-id">#{{ user._id }}</span>
                </div>
              </td>
              <td class="user-email">{{ user.email }}</td>
              <td class="user-role">
                <span class="role-badge" :class="getRoleClass(user.role.access_level)">
                  {{ getRoleName(user.role.access_level) }}
                </span>
              </td>
              <td class="user-date">
                {{ new Date(user.join_date).toLocaleDateString() }}
              </td>
              <td class="user-actions">
                <button class="action-btn view-btn" @click="openDetailsModal(user)" title="Voir les détails">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn edit-btn" @click="openEditModal(user)" title="Modifier">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" @click="handleDeleteUser(user)" title="Supprimer">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de modification -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-edit"></i>
            Modifier l'utilisateur
          </h2>
          <button class="modal-close" @click="showEditModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveUser" class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Prénom</label>
              <input 
                v-model="editForm.firstname" 
                class="form-input" 
                type="text" 
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Nom</label>
              <input 
                v-model="editForm.name" 
                class="form-input" 
                type="text" 
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              v-model="editForm.email" 
              class="form-input" 
              type="email" 
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea 
              v-model="editForm.description" 
              class="form-textarea" 
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Rôle</label>
            <select 
              v-model="editForm.role" 
              class="form-select" 
              required
            >
              <option value="0">Admin</option>
              <option value="1">Support</option>
              <option value="2">HR</option>
              <option value="3">Employee</option>
              <option value="4">Supplier</option>
              <option value="5">Service Provider</option>
              <option value="6">Delivery</option>
              <option value="7">User</option>
            </select>
          </div>
        </form>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showEditModal = false">
            <i class="fas fa-times"></i>
            Annuler
          </button>
          <button class="btn btn-primary" @click="saveUser">
            <i class="fas fa-save"></i>
            Sauvegarder
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            <i class="fas fa-user"></i>
            Détails de l'utilisateur
          </h2>
          <button class="modal-close" @click="showDetailsModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedUser">
          <div class="user-details">
            <div class="detail-section">
              <h3>Informations personnelles</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Nom complet:</label>
                  <span>{{ selectedUser.name }} {{ selectedUser.firstname }}</span>
                </div>
                <div class="detail-item">
                  <label>Email:</label>
                  <span>{{ selectedUser.email }}</span>
                </div>
                <div class="detail-item">
                  <label>Date de naissance:</label>
                  <span>{{ new Date(selectedUser.birthday).toLocaleDateString() }}</span>
                </div>
                <div class="detail-item">
                  <label>Date d'inscription:</label>
                  <span>{{ new Date(selectedUser.join_date).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h3>Statut et permissions</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>Rôle:</label>
                  <span class="role-badge" :class="getRoleClass(selectedUser.role.access_level)">
                    {{ getRoleName(selectedUser.role.access_level) }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>Niveau d'accès:</label>
                  <span>{{ selectedUser.role.access_level }}</span>
                </div>
                <div class="detail-item">
                  <label>Statut:</label>
                  <span :class="['status-badge', getStatusClass(selectedUser)]">
                    {{ getStatusText(selectedUser) }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>Tutoriel complété:</label>
                  <span>{{ selectedUser.tutorial ? 'Oui' : 'Non' }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section" v-if="selectedUser.description">
              <h3>Description</h3>
              <p>{{ selectedUser.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showDetailsModal = false">
            <i class="fas fa-times"></i>
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.users-management {
  min-height: 100vh;
  background: #1a1a1a;
  color: #fff;
  padding: 0;
}

.page-header {
  background: #2a2a2a;
  padding: 2rem 0;
  border-bottom: 1px solid #333;
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
  gap: 1rem;
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
  padding: 1.5rem 0;
  background: #2a2a2a;
}

.search-section .container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-section .field {
  margin-bottom: 0;
}

.search-section .input {
  background: #333;
  border: 1px solid #555;
  color: #fff;
}

.search-section .input:focus {
  border-color: #09ce44;
  box-shadow: 0 0 0 0.125em rgba(9, 206, 68, 0.25);
}

.search-section .input::placeholder {
  color: #ccc;
}

.search-section .button.is-success {
  background-color: #09ce44;
  border-color: #09ce44;
}

.search-section .button.is-success:hover {
  background-color: #0ab33a;
  border-color: #0ab33a;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.search-results {
  background: #333;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  color: #ccc;
  border-left: 4px solid #09ce44;
}

.search-results strong {
  color: #09ce44;
}

.search-results em {
  color: #fff;
  font-style: normal;
  font-weight: 600;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 0;
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

.empty-state i {
  font-size: 4rem;
  color: #09ce44;
  margin-bottom: 1rem;
}

.users-table {
  background: #2a2a2a;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: #1a1a1a;
  color: #09ce44;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #333;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #333;
}

.user-row:hover {
  background: #333;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.name-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.full-name {
  font-weight: 600;
}

.user-id {
  color: #ccc;
  font-size: 0.8rem;
}

.role-badge {
  background: #09ce44;
  color: #fff;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-admin {
  background: #e74c3c;
}

.role-support {
  background: #3498db;
}

.role-hr {
  background: #9b59b6;
}

.role-employee {
  background: #2ecc71;
}

.role-supplier {
  background: #f39c12;
}

.role-service-provider {
  background: #1abc9c;
}

.role-delivery {
  background: #34495e;
}

.role-user {
  background: #95a5a6;
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-approved {
  background: #09ce44;
  color: #fff;
}

.status-pending {
  background: #f39c12;
  color: #fff;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
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
}

.view-btn {
  background: #3498db;
  color: #fff;
}

.view-btn:hover {
  background: #2980b9;
  transform: scale(1.1);
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

/* Modal styles */
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
  background: #2a2a2a;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  border: 1px solid #444;
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
  gap: 0.5rem;
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
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #555;
}

.modal-body {
  padding: 2rem;
  max-height: 400px;
  overflow-y: auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #fff;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #444;
  border-radius: 10px;
  background: #333;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  outline: none;
  border-color: #09ce44;
  box-shadow: 0 0 0 3px rgba(9, 206, 68, 0.3);
}

.form-select option {
  background: #333;
  color: #fff;
  padding: 0.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
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
}

.btn-primary {
  background: #09ce44;
  color: #fff;
}

.btn-primary:hover {
  background: #0ab33a;
}

.user-details {
  color: #fff;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  color: #09ce44;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.detail-item label {
  font-weight: 600;
  color: #ccc;
  font-size: 0.9rem;
}

.detail-item span {
  color: #fff;
}

/* Responsive */
@media (max-width: 768px) {
  .table {
    font-size: 0.9rem;
  }
  
  .table th,
  .table td {
    padding: 0.5rem;
  }
  
  .user-actions {
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .action-btn {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .search-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-input-wrapper {
    max-width: none;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .users-table {
    overflow-x: auto;
  }
  
  .table {
    min-width: 800px;
  }
}
</style>
