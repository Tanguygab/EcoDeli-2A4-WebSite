<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    //callback(await get (pagination))
    callback([
        { id: 1, name: "Commerçant 1", email: "com1@mail.com" },
        { id: 2, name: "Commerçant 2", email: "com2@mail.com" },
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
    <h2 class="title">Gestion des Commerçants</h2>
    <AdminTable name="traders" @search="search" @delete="handleDelete" :columns="['id', 'name', 'email']" />
</template>
