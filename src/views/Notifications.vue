<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { startSession } from '@/stores/session'
import { api, getNotifications, deleteNotification } from '@/api'
import type { Notification } from '@/types/notification'
import router from '@/router'

const session = startSession()
api(session)
const user = session.user!!

const notifications = ref<Notification[]>([])
const loading = ref(false)
const search = ref('')
const sortOrder = ref<'desc' | 'asc'>('desc') // Tri par défaut : du plus récent au plus vieux

async function loadNotifications () {
  loading.value = true
  try {
    const all = await getNotifications()
    notifications.value = all
      .filter(n => n.user === user._id)
  } catch (e) {
    console.error(e)
    alert('Erreur lors du chargement des notifications')
  } finally {
    loading.value = false
  }
}

const filteredNotifications = computed(() => {
  let list = notifications.value
    .filter(n =>
      n.content.toLowerCase().includes(search.value.toLowerCase())
    )
  list = list.sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return sortOrder.value === 'desc' ? db - da : da - db
  })
  return list
})

async function remove(notification: Notification) {
  await deleteNotification(notification._id)
  notifications.value = notifications.value.filter(n => n._id !== notification._id)
}

onMounted(loadNotifications)
</script>

<template>
  <div class="notifications-container">
    <div class="notifications-header">
      <h1 class="title has-text-centered mb-4">{{ $t('user.notifications-title') }}</h1>
      
      <!-- Barre de recherche et tri -->
      <div class="notification-toolbar mb-4">
        <input
          v-model="search"
          class="input"
          type="text"
          :placeholder="$t('user.notifications-search')"
          style="max-width: 220px; font-size: 0.95rem;"
        />
        <button
          class="button is-success is-rounded sort-btn"
          @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
          :aria-label="sortOrder === 'desc'
            ? $t('user.notifications-sort.desc')
            : $t('user.notifications-sort.asc')"
          style="padding: 0.35em 0.9em; font-size: 0.95rem;"
        >
          <span class="icon">
            <i :class="sortOrder === 'desc' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'"></i>
          </span>
          <span>
            {{ sortOrder === 'desc'
              ? $t('user.notifications-sort.desc')
              : $t('user.notifications-sort.asc') }}
          </span>
        </button>
      </div>
    </div>

    <!-- Liste des notifications avec scrollbar -->
    <div v-if="loading" class="loading">Chargement…</div>
    
    <div v-else class="notifications-list">
      <div
        v-for="notification in filteredNotifications"
        :key="notification._id"
        class="notification-item"
        @click="notification.link && router.push(notification.link)"
      >
        <div class="notification-content">
          <small class="notification-date">{{ new Date(notification.date).toLocaleDateString() }}</small>
          <p class="notification-text">{{ notification.content }}</p>
        </div>
        <span
          class="delete-cross"
          @click.stop="remove(notification)"
          title="Supprimer"
        >&times;</span>
      </div>
      
      <div v-if="filteredNotifications.length === 0" class="no-notifications">
        <i class="fas fa-bell-slash"></i>
        <p>Aucune notification</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notifications-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  min-height: 80vh;
}

.notifications-header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding-bottom: 20px;
  border-bottom: 1px solid #333;
}

.notification-toolbar {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.notifications-list {
  max-height: 600px;
  overflow-y: auto;
  padding: 0;
  max-width: 750px;
  margin: 0 auto;
}

/* Scrollbar personnalisée */
.notifications-list::-webkit-scrollbar {
  width: 8px;
}

.notifications-list::-webkit-scrollbar-track {
  background: #333;
  border-radius: 4px;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: #00d1b2;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: #00b8a3;
}

.notification-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 25px;
  margin-bottom: 15px;
  border: 1px solid #00d1b2;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  background: transparent;
  min-height: 80px;
}

.notification-item:last-child {
  margin-bottom: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-date {
  color: #aaa;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 8px;
}

.notification-text {
  margin: 0;
  color: #fff;
  font-size: 1.05rem;
  line-height: 1.5;
  word-wrap: break-word;
}

.delete-cross {
  color: #999;
  font-size: 1.8rem;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 8px;
  margin-left: 15px;
  flex-shrink: 0;
}

.delete-cross:hover {
  color: #ff3860;
}

.no-notifications {
  text-align: center;
  padding: 40px 20px;
  color: #aaa;
}

.no-notifications i {
  font-size: 3rem;
  margin-bottom: 15px;
  color: #555;
}

.no-notifications p {
  margin: 0;
  font-size: 1.1rem;
}

.loading {
  text-align: center;
  padding: 40px 20px;
  color: #aaa;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-container {
    padding: 15px;
  }
  
  .notification-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .notification-toolbar .input {
    max-width: 100%;
  }
  
  .notifications-list {
    max-height: 500px;
  }
  
  .notification-item {
    padding: 18px 20px;
    min-height: 70px;
  }
}
</style>
