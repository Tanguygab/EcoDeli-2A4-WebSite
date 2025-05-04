<script setup lang="ts">
import router from '@/router';
import Icon from './Icon.vue';

import { newPagination, type Pagination } from '@/types/pagination';
const pagination: Pagination = newPagination()

import { ref } from 'vue';
const input = ref()
const list = ref<Array<any>>([])

const emit = defineEmits<{
    search: [pagination: Pagination, callback: (updatedList: Array<any>) => void],
    delete: [item: any, callback: () => void]
}>()

async function search() {
    pagination.filter = input.value ? input.value.trim() : ""
    emit('search', pagination, (updatedList: Array<any>) => list.value = updatedList)
}

async function handleDelete(item: any, index: number) {
    if (!confirm(`Delete ${item.id} ?`)) return
    emit('delete', item, () => list.value.splice(index, 1))
}

defineProps<{ name: string, columns: string[] }>()

function printColumn(string: string, key: string) {
    return key.includes("date") ? new Date(string).toLocaleDateString() : string
}

search()

function getMaxPages() {
    return pagination.page / list.value.length
}

let pages = ref<Array<string | number>>()
function setPage(page: string | number) {
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

    router.push({
        query: {
            page: pagination.page,
            filter: pagination.filter,
            ascending: pagination.ascending + "",
            max_entries: pagination.max_entries
        },
    })

}

setPage(pagination.page + 1)

</script>

<template>
    <div class="field is-grouped">
        <input v-model="input" class="input" type="text" :placeholder="$t('search.' + name)">
        <button class="button is-info" @click="search">
            <Icon icon="fa-search" />
        </button>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th v-for="column in columns">{{ $t(`table.${column === 'id' ? 'global' : name}.${column}`) }}</th>
                <th>{{ $t("table.actions.label") }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item, index in list" :key="item['id']">
                <td v-for="column in columns">{{ printColumn(item[column], column) }}</td>
                <td>
                    <a :title="$t('table.actions.see')" class="button is-info" :href="name + '/' + item['id']">
                        <Icon icon="fa-eye" />
                    </a>
                    <a :title="$t('table.actions.edit')" class="button is-primary mx-1"
                        :href="`${name}/${item['id']}/edit`">
                        <Icon icon="fa-edit" />
                    </a>
                    <button :title="$t('table.actions.delete')" class="button is-danger is-outlined">
                        <Icon icon="fa-trash" @click="handleDelete(item, index)" />
                    </button>
                </td>
            </tr>
        </tbody>
    </table>

    <nav class="pagination is-rounded is-centered" role="navigation" aria-label="pagination">
        <a v-if="pagination.page > 0" @click="setPage(pagination.page + '')" class="pagination-previous">{{
            $t("pagination.previous") }}</a>
        <a v-if="pagination.page < getMaxPages()" @click="setPage(pagination.page + 2 + '')" class="pagination-next">{{
            $t("pagination.next") }}</a>
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