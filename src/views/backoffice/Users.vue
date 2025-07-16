<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchUsers, updateUser, deleteUser, banUser, unbanUser, approveUser, unapproveUser, updateUserRole } from '@/api'
import type { User } from '@/types/user'
import type { Pagination } from '@/types/pagination'
import { newPagination } from '@/types/pagination'

const users = ref<User[]>([])
const loading = ref(false)
const search = ref('')
const pagination = newPagination()

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
    pagination.filter = search.value.trim()
    users.value = await searchUsers(pagination)
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
    users.value = []
  } finally {
    loading.value = false
  }
}

async function handleSearch() {
  await loadUsers()
}

function openEditModal(user: User) {
  editingUser.value = user
  editForm.value = {
    firstname: user.firstname,
    name: user.name,
    email: user.email,
    description: user.description,
    role: user.role._id
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
    if (editForm.value.role !== editingUser.value.role._id) {
      await updateUserRole(editingUser.value._id, editForm.value.role)
    }
    
    showEditModal.value = false
    await loadUsers()
    alert('Utilisateur modifié avec succès')
  } catch (error) {
    console.error('Erreur lors de la modification:', error)
    alert('Erreur lors de la modification de l\'utilisateur')
  }
}

async function handleDeleteUser(user: User) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstname} ${user.name} ?`)) {
    return
  }
  
  try {
    await deleteUser(user._id)
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
    await loadUsers()
    alert('Utilisateur débanni avec succès')
  } catch (error) {
    console.error('Erreur lors du débannissement:', error)
    alert('Erreur lors du débannissement de l\'utilisateur')
  }
}

async function handleApproveUser(user: User) {
  try {
    await approveUser(user._id)
    await loadUsers()
    alert('Utilisateur approuvé avec succès')
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error)
    alert('Erreur lors de l\'approbation de l\'utilisateur')
  }
}

async function handleUnapproveUser(user: User) {
  try {
    await unapproveUser(user._id)
    await loadUsers()
    alert('Approbation retirée avec succès')
  } catch (error) {
    console.error('Erreur lors du retrait d\'approbation:', error)
    alert('Erreur lors du retrait d\'approbation de l\'utilisateur')
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
      <div class="search-container">
        <div class="search-input-wrapper">
          <input
            v-model="search"
            class="search-input"
            type="text"
            placeholder="Rechercher un utilisateur..."
            @keyup.enter="handleSearch"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <button class="search-btn" @click="handleSearch">
          <i class="fas fa-search"></i>
          Rechercher
        </button>
      </div>
    </div>

    <div class="main-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>

      <div v-else-if="users.length === 0" class="empty-state">
        <i class="fas fa-users"></i>
        <h3>Aucun utilisateur trouvé</h3>
        <p>Aucun utilisateur ne correspond à votre recherche</p>
      </div>

      <div v-else class="users-table">
        <table class="table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
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
                  <span class="full-name">{{ user.firstname }} {{ user.name }}</span>
                  <span class="user-id">#{{ user._id }}</span>
                </div>
              </td>
              <td class="user-email">{{ user.email }}</td>
              <td class="user-role">
                <span class="role-badge">{{ user.role.name }}</span>
              </td>
              <td class="user-status">
                <span :class="['status-badge', getStatusClass(user)]">
                  {{ getStatusText(user) }}
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
                <button 
                  v-if="user.approved" 
                  class="action-btn ban-btn" 
                  @click="handleUnapproveUser(user)" 
                  title="Retirer l'approbation"
                >
                  <i class="fas fa-user-times"></i>
                </button>
                <button 
                  v-else 
                  class="action-btn approve-btn" 
                  @click="handleApproveUser(user)" 
                  title="Approuver"
                >
                  <i class="fas fa-check"></i>
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
            <label class="form-label">Rôle (ID)</label>
            <input 
              v-model="editForm.role" 
              class="form-input" 
              type="number" 
              required
            />
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
                  <span>{{ selectedUser.firstname }} {{ selectedUser.name }}</span>
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
                  <span class="role-badge">{{ selectedUser.role.name }}</span>
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
  padding: 2rem 0;
  background: #2a2a2a;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
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

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #09ce44;
}

.search-btn {
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
}

.search-btn:hover {
  background: #0ab33a;
  transform: translateY(-2px);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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

.approve-btn {
  background: #27ae60;
  color: #fff;
}

.approve-btn:hover {
  background: #219a52;
  transform: scale(1.1);
}

.ban-btn {
  background: #e74c3c;
  color: #fff;
}

.ban-btn:hover {
  background: #c0392b;
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

.form-input, .form-textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #444;
  border-radius: 10px;
  background: #333;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #09ce44;
  box-shadow: 0 0 0 3px rgba(9, 206, 68, 0.3);
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
