<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import type { User } from '@/types/user';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    //callback(await get (pagination))
    callback([
        { id: 1 },
        { id: 2 },
    ])
}

async function handleDelete(user: User, callback: () => void) {
    try {
        //await delete (user)
        callback()
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">Gestion des Livreurs</h2>
    <AdminTable name="deliverymen" @search="search" @delete="handleDelete" :columns="['id']" />
</template>
