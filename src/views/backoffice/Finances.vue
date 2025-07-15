<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import { getFinances, deleteFinance } from '@/api.ts';

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
    <h2 class="title">Gestion des Finances</h2>
    <AdminTable name="finances" @search="search" @delete="handleDelete" :columns="['_id', 'type', 'amount', 'date']" />
</template>
