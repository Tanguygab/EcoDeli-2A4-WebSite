<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    //callback(await get (pagination))
    callback([
        { _id: 1, name: "Prestataire 1", email: "presta1@mail.com", phone: "0612345678" },
        { _id: 2, name: "Prestataire 2", email: "presta2@mail.com", phone: "0698765432" },
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
    <h2 class="title">Gestion des Prestataires</h2>
    <AdminTable name="prestataires" @search="search" @delete="handleDelete"
        :columns="['_id', 'name', 'email', 'phone']" />
</template>
