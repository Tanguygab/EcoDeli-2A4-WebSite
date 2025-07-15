<script setup lang="ts">
import { getContracts, deleteContract } from '@/api';
import AdminTable from '@/components/AdminTable.vue';
import type { Contract } from '@/types/contract';
import type { Pagination } from '@/types/pagination';

const columns = [
    { key: '_id', label: 'table.contracts._id' },
    { key: 'start_date', label: 'table.contracts.start_date' },
    { key: 'end_date', label: 'table.contracts.end_date' },
    { key: 'filepath', label: 'table.contracts.filepath' },
    { key: 'user', label: 'table.contracts.user' }
];

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
        // Optionally show an error message
    }
}
</script>

<template>
    <h2 class="title">{{ $t('table.contracts.title') }}</h2>
    <AdminTable
        name="contracts"
        @search="search"
        @delete="handleDelete"
        :columns="columns"
    />
</template>
