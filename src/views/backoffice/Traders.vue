<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import { getTraders, deleteTrader } from '@/api';

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
    <h2 class="title">Gestion des Commerçants</h2>
    <AdminTable name="traders" @search="search" @delete="handleDelete" :columns="['_id', 'name', 'email']" />
</template>
