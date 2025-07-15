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
  <div class="container mt-5">
    <h1 class="title has-text-centered mb-4">{{ $t('user.notifications-title') }}</h1>

    <!-- Barre de recherche et tri améliorée -->
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

    <div v-if="loading" class="loading">Chargement…</div>

    <div v-else>
      <div
        v-for="notification in filteredNotifications"
        :key="notification._id"
        class="box notification-item"
        @click="notification.link && router.push(notification.link)"
      >
        <small class="tag">{{ new Date(notification.date).toLocaleDateString() }}</small>
        <p>{{ notification.content }}</p>
        <span
          class="delete-cross"
          @click.stop="remove(notification)"
          title="Supprimer"
        >&times;</span>
      </div>
      <div v-if="filteredNotifications.length === 0" class="has-text-centered mt-5">
        Aucune notification
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading { text-align: center; padding: 2rem; }
.notification-item {
  position: relative;
  padding-right: 2.5rem;
}
.delete-cross {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: #e74c3c;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s;
}
.delete-cross:hover {
  color: #c0392b;
}
.notification-toolbar {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: center;
  flex-wrap: wrap;
}
.sort-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 140px;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  background: #23d160; /* vert Bulma/EcoDeli */
  color: #fff;
  border: none;
  transition: background 0.2s;
}
.sort-btn .icon {
  font-size: 1.1rem;
}
.sort-btn:hover {
  background: #00c853; /* vert plus foncé au hover */
}
</style>
