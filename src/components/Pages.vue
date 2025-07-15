<script setup lang="ts">
import type { Pagination } from '@/types/pagination'
import { computed } from 'vue'

const props = defineProps<{
  pagination: Pagination
  list: any[]
}>()

const emit = defineEmits(['update'])

const currentPage = computed(() => props.pagination.page)
const limit = computed(() => props.pagination.limit)
const isFirstPage = computed(() => currentPage.value === 0)
const isLastPage = computed(() => props.list.length < limit.value)

function nextPage() {
  if (!isLastPage.value) {
    props.pagination.page++
    emit('update')
  }
}

function previousPage() {
  if (!isFirstPage.value) {
    props.pagination.page--
    emit('update')
  }
}
</script>

<template>
  <div class="pagination-container">
    <button
      class="pagination-button"
      :disabled="isFirstPage"
      @click="previousPage"
    >
      ◀ Précédent
    </button>

    <span class="pagination-info">
      Page {{ currentPage + 1 }}
    </span>

    <button
      class="pagination-button"
      :disabled="isLastPage"
      @click="nextPage"
    >
      Suivant ▶
    </button>
  </div>
</template>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.pagination-button {
  background-color: #146eff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.pagination-button:disabled {
  background-color: #444;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 1rem;
  font-weight: bold;
  color: #ccc;
}
</style>
