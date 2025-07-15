<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import { getPayments, deletePayment } from '@/api';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    try {
        const payments = await getPayments(pagination);
        callback(payments);
    } catch (e) {
        callback([]);
    }
}

async function handleDelete(item: any, callback: () => void) {
    try {
        await deletePayment(item);
        callback();
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">Gestion des Paiements</h2>
    <AdminTable name="payments" @search="search" @delete="handleDelete" :columns="['_id', 'date', 'amount', 'status']" />
</template>
