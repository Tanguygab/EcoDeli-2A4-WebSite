<script setup lang="ts">
import { ref } from 'vue'
import { joinDeliveries } from '@/api'
import router from '@/router'

const form = ref<HTMLFormElement>()
const sent = ref(false)

async function submit() {
    const formData = new FormData(form.value)
    await joinDeliveries(formData)
    sent.value = true
    // Optionnel : router.push('/deliverymen/')
}
</script>

<template>
  <form v-if="!sent" ref="form" class="box" @submit.prevent="submit" enctype="multipart/form-data">
    <h2 class="title is-4 mb-4">{{ $t("delivery.request-title") || "Demande de recrutement livreur" }}</h2>
    <div class="field">
      <label class="label">{{ $t("form.file") || "Pièce justificative" }}</label>
      <input class="input" name="proof" type="file" />
    </div>
    <input type="submit" class="button is-success mt-3" :value="$t('contact.send') || 'Envoyer la demande'">
  </form>
  <div v-else class="notification is-success has-text-centered">
    {{ $t("delivery.thanks") || "Merci pour votre candidature ! Nous reviendrons vers vous rapidement." }}
  </div>
</template>
