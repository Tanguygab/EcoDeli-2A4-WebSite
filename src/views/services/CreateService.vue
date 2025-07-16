
<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { startSession } from '@/stores/session';
import { createService } from '@/api';

const router = useRouter();
const session = startSession();

const loading = ref(false);
const error = ref('');
const success = ref(false);

const form = reactive({
  name: '',
  description: '',
  price: '',
  date: ''
});

async function submitForm() {
  if (!form.name || !form.description || !form.price || !form.date) {
    error.value = 'Veuillez remplir tous les champs obligatoires';
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const serviceData = {
      name: form.name,
      description: form.description,
      price: form.price,
      date: form.date,
    };
    await createService(serviceData);
    success.value = true;
    setTimeout(() => {
      router.push('/services');
    }, 2000);
  } catch (err: any) {
    error.value = err.message || 'Erreur lors de la création du service';
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push('/services');
}
</script>


<template>
  <div class="container mt-5">
    <div class="columns is-centered">
      <div class="column is-8">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title is-flex is-justify-content-space-between">
              <h1 class="title is-4">{{ $t('services.create-service') }}</h1>
              <button @click="goBack" class="button is-light">
                <span class="icon">
                  <i class="fas fa-arrow-left"></i>
                </span>
                <span>{{ $t('common.back') }}</span>
              </button>
            </div>
          </div>
          <div class="card-content">
            <div v-if="success" class="notification is-success">
              <p>{{ $t('services.service-created-successfully') }}</p>
            </div>
            <div v-if="error" class="notification is-danger">
              <p>{{ error }}</p>
            </div>
            <form @submit.prevent="submitForm">
              <div class="field">
                <label class="label">{{ $t('services.title') }} *</label>
                <div class="control">
                  <input
                    v-model="form.name"
                    class="input"
                    type="text"
                    :placeholder="$t('services.title-placeholder')"
                    required
                  />
                </div>
              </div>
              <div class="field">
                <label class="label">{{ $t('services.description') }} *</label>
                <div class="control">
                  <textarea
                    v-model="form.description"
                    class="textarea"
                    :placeholder="$t('services.description-placeholder')"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <div class="columns">
                <div class="column">
                  <div class="field">
                    <label class="label">{{ $t('services.price') }} *</label>
                    <div class="control has-icons-right">
                      <input
                        v-model="form.price"
                        class="input"
                        type="number"
                        step="0.01"
                        min="0"
                        :placeholder="$t('services.price-placeholder')"
                        required
                      />
                      <span class="icon is-small is-right">
                        <i class="fas fa-euro-sign"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <div class="field">
                    <label class="label">{{ $t('services.availability') }} *</label>
                    <div class="control">
                      <input
                        v-model="form.date"
                        class="input"
                        type="datetime-local"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="field is-grouped is-grouped-right">
                <div class="control">
                  <button
                    type="button"
                    @click="goBack"
                    class="button is-light"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                </div>
                <div class="control">
                  <button
                    type="submit"
                    class="button is-primary"
                    :class="{ 'is-loading': loading }"
                    :disabled="loading"
                  >
                    {{ $t('services.create-service') }}
                  </button>
                </div>
              </div>
            </form>
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
.field {
  margin-bottom: 1.5rem;
}
.notification {
  margin-bottom: 1.5rem;
}
</style>
