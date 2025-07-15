<script setup lang="ts">
import type { Pagination } from '@/types/pagination'
import { computed } from 'vue'

const props = defineProps<{
  pagination: Pagination
  list: any[]
}>()

const emit = defineEmits(['changePage'])

const currentPage = computed(() => props.pagination.page)
const limit = computed(() => props.pagination.limit)
const totalItems = computed(() => props.list.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / limit.value)))

const isFirstPage = computed(() => currentPage.value <= 0)
const isLastPage = computed(() => currentPage.value >= totalPages.value - 1)

function nextPage() {
  if (!isLastPage.value) emit('changePage', currentPage.value + 1)
}
function previousPage() {
  if (!isFirstPage.value) emit('changePage', currentPage.value - 1)
}
</script>

<template>
  <div class="pagination-container">
    <button
      class="pagination-button"
      :disabled="isFirstPage"
      @click="previousPage"
    >
      ◀ {{ $t('pagination.previous') }}
    </button>

    <span class="pagination-info">
      {{ $t('pagination.page', { page: currentPage + 1 }) }} / {{ totalPages }}
    </span>

    <button
      class="pagination-button"
      :disabled="isLastPage"
      @click="nextPage"
    >
      {{ $t('pagination.next') }} ▶
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
