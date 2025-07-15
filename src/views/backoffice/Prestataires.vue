<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import { getPrestataires, deletePrestataire } from '@/api';

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
    <h2 class="title">Gestion des Prestataires</h2>
    <AdminTable name="prestataires" @search="search" @delete="handleDelete"
        :columns="['_id', 'name', 'email', 'phone']" />
</template>
