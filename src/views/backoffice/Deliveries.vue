<script setup lang="ts">
import { deleteDelivery, getDeliveries } from '@/api';
import AdminTable from '@/components/AdminTable.vue';
import type { Delivery } from '@/types/delivery';
import type { Pagination } from '@/types/pagination';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    //callback(await getDeliveries(pagination))
    callback([
        { _id: 1, latitude: 48.8566, longitude: 2.3522, products: 0, deliveryman: undefined },
        { _id: 2, latitude: 45.7640, longitude: 4.8357, products: 2, deliveryman: undefined }
    ])
}

async function handleDelete(delivery: Delivery, callback: () => void) {
    try {
        //await deleteDelivery(delivery)
        callback()
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">Gestion des Livraisons</h2>
    <AdminTable name="deliveries" @search="search" @delete="handleDelete" :columns="['_id', 'latitude', 'longitude', 'products']" />
</template>
