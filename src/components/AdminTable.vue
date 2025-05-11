<script setup lang="ts">
import Icon from './Icon.vue';
import Pages from './Pages.vue';
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
            <tr v-for="(item, index) in list" :key="item['id']">
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
    <Pages :list="list" :pagination="pagination" />
</template>
