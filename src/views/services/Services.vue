<script setup lang="ts">
import { ref, reactive } from 'vue'
import { api, getServices, isSessionValid, createService } from '@/api'
import { newPagination } from '@/types/pagination'
import { startSession } from '@/stores/session'
import type { Service } from '@/types/service'

const session = startSession()
api(session)
const loggedIn = ref<boolean>(false)
isSessionValid(false).then((valid: boolean) => loggedIn.value = valid)

const pagination = newPagination()
const services = ref<Service[]>([])
const loading = ref(false)
const error = ref('')
const showForm = ref(false)
const form = reactive({
  name: '',
  description: '',
  price: '',
  date: ''
})

function refreshServices() {
  getServices(pagination).then(data => services.value = data)
}
refreshServices()

function openForm() {
  showForm.value = true
  error.value = ''
  form.name = ''
  form.description = ''
  form.price = ''
  form.date = ''
}
function closeForm() {
  showForm.value = false
}

async function submitForm() {
  if (!form.name || !form.description || !form.price || !form.date) {
    error.value = 'Veuillez remplir tous les champs obligatoires';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    await createService({
      name: form.name,
      description: form.description,
      price: form.price,
      date: form.date
    })
    closeForm()
    refreshServices()
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la création du service';
  } finally {
    loading.value = false;
  }
}

</script>

<template>
    <div class="container mt-5">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <h1 class="title">{{ $t("service.list-title") }}</h1>
                </div>
            </div>
            <div class="level-right">
                <div class="level-item">
                    <button class="button is-primary" @click="openForm">
                        <span class="icon">
                            <i class="fas fa-plus"></i>
                        </span>
                        <span>{{ $t("service.create-button") }}</span>
                    </button>
                </div>
            </div>
        <!-- Formulaire de création de service (modal simple) -->
        <div v-if="showForm" class="modal is-active">
          <div class="modal-background" @click="closeForm"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">{{ $t('service.create-title') }}</p>
              <button class="delete" aria-label="close" @click="closeForm"></button>
            </header>
            <section class="modal-card-body">
              <div v-if="error" class="notification is-danger">{{ error }}</div>
              <form @submit.prevent="submitForm">
                <div class="field">
                  <label class="label">{{ $t('services.title') }} *</label>
                  <div class="control">
                    <input v-model="form.name" class="input" type="text" :placeholder="$t('services.title-placeholder')" required />
                  </div>
                </div>
                <div class="field">
                  <label class="label">{{ $t('services.description') }} *</label>
                  <div class="control">
                    <textarea v-model="form.description" class="textarea" :placeholder="$t('services.description-placeholder')" rows="3" required></textarea>
                  </div>
                </div>
                <div class="field">
                  <label class="label">{{ $t('services.price') }} *</label>
                  <div class="control has-icons-right">
                    <input v-model="form.price" class="input" type="number" step="0.01" min="0" :placeholder="$t('services.price-placeholder')" required />
                    <span class="icon is-small is-right"><i class="fas fa-euro-sign"></i></span>
                  </div>
                </div>
                <div class="field">
                  <label class="label">{{ $t('services.availability') }} *</label>
                  <div class="control">
                    <input v-model="form.date" class="input" type="datetime-local" required />
                  </div>
                </div>
                <div class="field is-grouped is-grouped-right mt-4">
                  <div class="control">
                    <button type="button" class="button is-light" @click="closeForm">{{ $t('common.cancel') }}</button>
                  </div>
                  <div class="control">
                    <button type="submit" class="button is-primary" :class="{ 'is-loading': loading }" :disabled="loading">{{ $t('services.create-service') }}</button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
        </div>

        <div v-if="services.length === 0" class="notification is-info">
            {{ $t("service.no-services") }}
        </div>

        <div v-else class="columns is-multiline">
            <div class="column is-6" v-for="service in services" :key="service._id">
                <div class="card" style="cursor: pointer;" @click="router.push('/services/' + service._id)">
                    <div class="card-image" v-if="service.image">
                        <figure class="image is-4by3">
                            <img :src="service.image" :alt="service.name">
                        </figure>
                    </div>
                    <div class="card-content">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                    <img :src="service.user?.image || 'https://bulma.io/assets/images/placeholders/96x96.png'" :alt="service.user?.name">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="title is-4">{{ service.name }}</p>
                                <p class="subtitle is-6">{{ service.user?.name }}</p>
                            </div>
                        </div>
                        <div class="content">
                            <p>{{ service.description }}</p>
                            <div class="tags">
                                <span class="tag is-primary">{{ service.price }}€</span>
                                <span class="tag is-light">{{ new Date(service.date).toLocaleDateString() }}</span>
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
    transition: transform 0.2s ease-in-out;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.level {
    margin-bottom: 2rem;
}
</style>
