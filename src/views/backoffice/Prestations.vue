<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import { getPrestations, deletePrestation } from '@/api';

const columns = [
    { key: '_id', label: 'table.prestations._id' },
    { key: 'service', label: 'table.prestations.service' },
    { key: 'client', label: 'table.prestations.client' },
    { key: 'status', label: 'table.prestations.status' }
];

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    try {
        const prestations = await getPrestations(pagination);
        callback(prestations);
    } catch (e) {
        callback([]);
    }
}

async function handleDelete(item: any, callback: () => void) {
    try {
        await deletePrestation(item);
        callback();
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">{{ $t('table.prestations.title') }}</h2>
    <AdminTable name="prestations" @search="search" @delete="handleDelete" :columns="columns" />
</template>
