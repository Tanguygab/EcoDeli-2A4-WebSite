<script setup lang="ts">
import { getContracts, deleteContract } from '@/api';
import AdminTable from '@/components/AdminTable.vue';
import type { Contract } from '@/types/contract';
import type { Pagination } from '@/types/pagination';

async function search(pagination: Pagination, callback: (updatedList: Array<Contract>) => void) {
    try {
        const contracts = await getContracts(pagination);
        callback(contracts);
    } catch (e) {
        callback([]);
    }
}

async function handleDelete(contract: Contract, callback: () => void) {
    try {
        await deleteContract(contract);
        callback();
    } catch (e) {
    }
}
</script>

<template>
    <h2 class="title">Gestion des Contrats</h2>
    <AdminTable
        name="contracts"
        @search="search"
        @delete="handleDelete"
        :columns="['_id', 'start_date', 'end_date', 'filepath', 'user']"
    />
</template>
