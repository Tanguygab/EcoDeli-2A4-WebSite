<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import { getFinances, deleteFinance } from '@/api.ts';

const columns = [
    { key: '_id', label: 'table.finances._id' },
    { key: 'type', label: 'table.finances.type' },
    { key: 'amount', label: 'table.finances.amount' },
    { key: 'date', label: 'table.finances.date' }
];

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    try {
        const finances = await getFinances(pagination);
        callback(finances);
    } catch (e) {
        callback([]);
    }
}

async function handleDelete(item: any, callback: () => void) {
    try {
        await deleteFinance(item);
        callback();
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">{{ $t('table.finances.title') }}</h2>
    <AdminTable name="finances" @search="search" @delete="handleDelete" :columns="columns" />
</template>
