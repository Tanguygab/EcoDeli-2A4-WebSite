<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import { getPrestataires, deletePrestataire } from '@/api';

const columns = [
    { key: '_id', label: 'table.prestataires._id' },
    { key: 'name', label: 'table.prestataires.name' },
    { key: 'email', label: 'table.prestataires.email' },
    { key: 'phone', label: 'table.prestataires.phone' }
];

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    try {
        const prestataires = await getPrestataires(pagination);
        callback(prestataires);
    } catch (e) {
        callback([]);
    }
}

async function handleDelete(item: any, callback: () => void) {
    try {
        await deletePrestataire(item);
        callback();
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">{{ $t('table.prestataires.title') }}</h2>
    <AdminTable
        name="prestataires"
        @search="search"
        @delete="handleDelete"
        :columns="columns"
    />
</template>
