<script setup lang="ts">
import { ref } from 'vue'
import { joinDeliveries } from '@/api.ts'
import router from '@/router'

const form = ref<HTMLFormElement>()

function submit() {
    const formData = new FormData(form.value);
    joinDeliveries(formData).then(() => {
        router.push('/deliverymen/')
    })
}
</script>

<template>
  <form ref="form" class="box" @submit.prevent="submit" enctype="multipart/form-data">
    <h2 class="title is-4 mb-4">Demande de recrutement livreur</h2>
    <div class="field">
      <label class="label">Pièce justificative</label>
      <input class="input" name="proof" type="file" />
    </div>
    <input type="submit" class="button is-success mt-3" value="Envoyer la demande">
  </form>
</template>
