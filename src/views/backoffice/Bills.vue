<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import type { Bill } from '@/types/bill';
import { getBills, deleteBill } from '@/api';

async function search(pagination: Pagination, callback: (updatedList: Array<Bill>) => void) {
    try {
        const bills = await getBills(pagination);
        callback(bills);
    } catch (e) {
        callback([]);
    }
}

async function handleDelete(bill: Bill, callback: () => void) {
    try {
        await deleteBill(bill);
        callback();
    } catch (e) {
        // Optionally show an error message
    }
}
</script>

<template>
    <h2 class="title">Gestion des Factures</h2>
    <AdminTable
        name="bills"
        @search="search"
        @delete="handleDelete"
        :columns="['_id', 'date', 'price', 'filepath', 'buyer', 'receiver']"
    />
</template>
