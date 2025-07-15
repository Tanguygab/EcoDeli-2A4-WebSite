<script setup lang="ts">
import { deleteDelivery, getDeliveries } from '@/api';
import AdminTable from '@/components/AdminTable.vue';
import type { Delivery } from '@/types/delivery';
import type { Pagination } from '@/types/pagination';

const columns = [
    { key: '_id', label: 'table.deliveries._id' },
    { key: 'latitude', label: 'table.deliveries.latitude' },
    { key: 'longitude', label: 'table.deliveries.longitude' },
    { key: 'products', label: 'table.deliveries.products' },
    { key: 'deliveryman', label: 'table.deliveries.deliveryman' }
];

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
        // Optionally show an error message
    }
}
</script>

<template>
    <h2 class="title">{{ $t('table.deliveries.title') }}</h2>
    <AdminTable
        name="deliveries"
        @search="search"
        @delete="handleDelete"
        :columns="columns"
    />
</template>
