<script setup lang="ts">
import { deleteDelivery, getDeliveries } from '@/api';
import AdminTable from '@/components/AdminTable.vue';
import type { Delivery } from '@/types/delivery';
import type { Pagination } from '@/types/pagination';

async function search(pagination: Pagination, callback: (updatedList: Array<Delivery>) => void) {
    try {
        const deliveries = await getDeliveries(pagination);
        callback(deliveries);
    } catch (e) {
        callback([]);
    }
}

async function handleDelete(delivery: Delivery, callback: () => void) {
    try {
        await deleteDelivery(delivery);
        callback();
    } catch (e) {
    }
}
</script>

<template>
    <h2 class="title">Gestion des Livraisons</h2>
    <AdminTable
        name="deliveries"
        @search="search"
        @delete="handleDelete"
        :columns="['_id', 'latitude', 'longitude', 'products', 'deliveryman']"
    />
</template>
