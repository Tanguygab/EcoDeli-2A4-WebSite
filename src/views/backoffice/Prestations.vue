<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    //callback(await get (pagination))
    callback([
        { _id: 1, service: "Nettoyage", client: "Jean Dupont", status: "Terminé" },
        { _id: 2, service: "Livraison", client: "Marie Curie", status: "En cours" },
    ])
}

async function handleDelete(item: any, callback: () => void) {
    try {
        //await delete (user)
        callback()
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">Gestion des Prestations</h2>
    <AdminTable name="prestations" @search="search" @delete="handleDelete" :columns="['_id', 'service', 'client', 'status']" />
</template>
