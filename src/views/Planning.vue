<template>
  <div class="planning-page p-6">
    <div class="box has-text-centered mb-5">
      <img
        src="https://placekitten.com/128/128"
        alt="User avatar"
        class="is-rounded"
        style="border-radius: 50%; width: 128px; height: 128px"
      />
      <p class="mt-3">Nom : <strong>Jean</strong></p>
      <p>Prénom : <strong>Dupont</strong></p>
    </div>

    <div class="columns">
      <div class="column has-text-centered">
        <label class="label">Liste des livraisons effectuées :</label>
        <div class="box">(contenu à ajouter)</div>
      </div>
      <div class="column has-text-centered">
        <label class="label">Liste des livraisons privées :</label>
        <div class="box">(contenu à ajouter)</div>
      </div>
    </div>

    <div class="buttons is-centered mt-5 mb-3">
      <button class="button is-success" @click="openPopup('add')">Ajouter</button>
      <button class="button is-danger" @click="openPopup('delete')">Supprimer</button>
      <button class="button is-warning" @click="openPopup('edit')">Modifier</button>
      <button class="button is-info" @click="openPopup('validate')">Valider</button>
      <button class="button is-dark" @click="openPopup('refuse')">Refuser</button>
    </div>

    <div class="box has-text-centered">
      <h2 class="title is-5">Planning :</h2>
      <div class="calendar-placeholder mt-4" />
    </div>

    <div v-if="activePopup" class="modal is-active">
      <div class="modal-background" @click="closePopup"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ popupTitle }}</p>
          <button class="delete" aria-label="close" @click="closePopup"></button>
        </header>
        <section class="modal-card-body">
          (Contenu pour l'action : <strong>{{ activePopup }}</strong>)
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="closePopup">Confirmer</button>
          <button class="button" @click="closePopup">Annuler</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activePopup = ref<string | null>(null)

const popupTitle = computed(() => {
  switch (activePopup.value) {
    case 'add': return 'Ajouter un créneau'
    case 'delete': return 'Supprimer une entrée'
    case 'edit': return 'Modifier une disponibilité'
    case 'validate': return 'Valider une réunion'
    case 'refuse': return 'Refuser une réunion'
    default: return ''
  }
})

function openPopup(type: string) {
  activePopup.value = type
}
function closePopup() {
  activePopup.value = null
}
</script>

<style scoped>
.calendar-placeholder {
  height: 300px;
  border: 2px dashed #999;
  border-radius: 8px;
  background-color: #f4f4f4;
}
</style>
