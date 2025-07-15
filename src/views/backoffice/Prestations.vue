<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import { getPrestations, deletePrestation } from '@/api';

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
    <h2 class="title">Gestion des Prestations</h2>
    <AdminTable name="prestations" @search="search" @delete="handleDelete" :columns="['_id', 'service', 'client', 'status']" />
</template>
