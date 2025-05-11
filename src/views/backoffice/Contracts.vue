<script setup lang="ts">
import { getContracts, deleteContract } from '@/api';
import AdminTable from '@/components/AdminTable.vue';
import type { Contract } from '@/types/contract';
import type { Pagination } from '@/types/pagination';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    //callback(await getContracts(pagination))
    callback([
        { _id: 1, start_date: new Date("2024-01-01"), end_date: new Date("2024-12-31"), filepath: "contrat1.pdf", user: undefined },
        { _id: 2, start_date: new Date("2024-02-01"), end_date: new Date("2024-11-30"), filepath: "contrat2.pdf", user: undefined },
    ])
}

async function handleDelete(contract: Contract, callback: () => void) {
    try {
        //await deleteContract(contract)
        callback()
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">Gestion des Contrats</h2>
    <AdminTable name="contracts" @search="search" @delete="handleDelete" :columns="['_id', 'start_date', 'end_date']" />
</template>
