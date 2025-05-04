<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    //callback(await get (pagination))
    callback([
        { id: 1, type: "Revenu", amount: "500€", date: "2024-03-12" },
        { id: 2, type: "Dépense", amount: "200€", date: "2024-03-10" },
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
    <h2 class="title">Gestion des Finances</h2>
    <AdminTable name="finances" @search="search" @delete="handleDelete" :columns="['id', 'type', 'amount', 'date']" />
</template>
