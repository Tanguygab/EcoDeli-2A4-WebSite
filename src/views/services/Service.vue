<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { startSession } from '@/stores/session'
import { getService } from '@/api'
import type { Service } from '@/types/service'

const route = useRoute()
const router = useRouter()
const session = startSession()

const service = ref<Service | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const serviceId = parseInt(route.params.id as string)
    service.value = await getService(serviceId)
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement du service'
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/services')
}
</script>

<template>
  <div class="container mt-5">
    <div class="columns is-centered">
      <div class="column is-8">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title is-flex is-justify-content-space-between">
              <h1 class="title is-4">{{ $t('services.service-details') }}</h1>
              <button @click="goBack" class="button is-light">
                <span class="icon">
                  <i class="fas fa-arrow-left"></i>
                </span>
                <span>{{ $t('common.back') }}</span>
              </button>
            </div>
          </div>
          
          <div class="card-content">
            <div v-if="loading" class="has-text-centered">
              <div class="loader"></div>
              <p>{{ $t('common.loading') }}</p>
            </div>
            
            <div v-else-if="error" class="notification is-danger">
              <p>{{ error }}</p>
            </div>

            <div v-else-if="service" class="content">
              <div class="columns">
                <div class="column is-8">
                  <h2 class="title is-3">{{ service.name }}</h2>
                  <p class="subtitle is-6">{{ new Date(service.date).toLocaleDateString() }}</p>
                  
                  <div class="content">
                    <p>{{ service.description }}</p>
                  </div>
                </div>

                <div class="column is-4">
                  <div class="box has-text-centered">
                    <div class="price">
                      <span class="title is-2 has-text-primary">{{ service.price }}€</span>
                    </div>
                    

                  </div>

                  <div v-if="service.image" class="mt-4">
                    <figure class="image is-4by3">
                      <img :src="service.image" :alt="service.name" />
                    </figure>
                  </div>
                </div>
              </div>

              <div class="mt-5" v-if="service.user">
                <h3 class="title is-5">{{ $t('services.provider-info') }}</h3>
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img class="is-rounded" :src="service.user.image || '/default-avatar.png'" :alt="service.user.name" />
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-6">{{ service.user.name }}</p>
                    <p class="subtitle is-7">{{ service.user.email }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.price {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.box {
  border: 1px solid #e0e0e0;
}

.media {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
}
</style>
