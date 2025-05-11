<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    //callback(await get (pagination))
    callback([
        { _id: 1, date: "2024-03-10", amount: "100€", status: "Effectué" },
        { _id: 2, date: "2024-02-25", amount: "250€", status: "En attente" },
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
    <h2 class="title">Gestion des Paiments</h2>
    <AdminTable name="payments" @search="search" @delete="handleDelete" :columns="['_id', 'date', 'amount', 'status']" />
</template>
