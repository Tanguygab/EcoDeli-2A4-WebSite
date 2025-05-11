<script setup lang="ts">
import { ref, watch } from 'vue'
import router from '@/router'
import type { Pagination } from '@/types/pagination.ts'
import type { LocationQueryRaw } from 'vue-router'

const props = defineProps<{pagination: Pagination, list: Array<any>}>()

function getMaxPages() {
    return props.list.length ? props.pagination.page / props.list.length : 0
}

let pages = ref<Array<string | number>>()
function setPage(page: string | number) {
    const pagination = props.pagination
    pagination.page = parseInt(page as string) - 1

    if (pagination.page < 0) {
        pagination.page = 0
        page = "1"
    }

    const max = getMaxPages()
    if (pagination.page > max) {
        pagination.page = max
        page = max + 1 + ""
    }


    const pages0 = []
    if (pagination.page < 4) {
        if (pagination.page > 2) pages0.push(pagination.page - 2)
        if (pagination.page > 1) pages0.push(pagination.page - 1)
        if (pagination.page > 0) pages0.push(pagination.page)
    } else pages0.push(1, '...', pagination.page)

    pages0.push(page)

    if (pagination.page > max - 4) {
        if (pagination.page < max - 2) pages0.push(max - 1)
        if (pagination.page < max - 1) pages0.push(max)
        if (pagination.page < max) pages0.push(max + 1)
    } else pages0.push(pagination.page + 2, '...', max + 1)

    pages.value = pages0
    router.push({query: pagination as unknown as LocationQueryRaw})
}

setPage(props.pagination.page + 1)
watch(props, newProps => setPage(newProps.pagination.page + 1))

</script>

<template>
  <nav class="pagination is-rounded is-centered" role="navigation" aria-label="pagination">
    <a v-if="pagination.page > 0" @click="setPage(pagination.page + '')" class="pagination-previous">{{ $t("pagination.previous") }}</a>
    <a v-if="pagination.page < getMaxPages()" @click="setPage(pagination.page + 2 + '')" class="pagination-next">{{ $t("pagination.next") }}</a>
    <ul class="pagination-list">
      <li v-for="page in pages">
        <span v-if="page === '...'" class="pagination-ellipsis">&hellip;</span>
        <a v-else @click="setPage(page)" :title="$t('pagination.page', {page: page})"
           :class="'pagination-link' + (pagination.page + 1 == page ? ' is-current' : '')">
          {{ page }}
        </a>
      </li>
    </ul>
  </nav>

</template>
