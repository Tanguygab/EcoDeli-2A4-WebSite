<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import { getTraders, deleteTrader } from '@/api';

const columns = [
    { key: '_id', label: 'table.traders._id' },
    { key: 'name', label: 'table.traders.name' },
    { key: 'email', label: 'table.traders.email' }
];

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    try {
        const traders = await getTraders(pagination);
        callback(traders);
    } catch (e) {
        callback([]);
    }
}

async function handleDelete(item: any, callback: () => void) {
    try {
        await deleteTrader(item);
        callback();
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">{{ $t('table.traders.title') }}</h2>
    <AdminTable name="traders" @search="search" @delete="handleDelete" :columns="columns" />
</template>
