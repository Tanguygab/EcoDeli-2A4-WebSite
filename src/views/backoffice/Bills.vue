<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import type { Bill } from '@/types/bill';
import { getBills, deleteBill } from '@/api';

const columns = [
    { key: '_id', label: 'table.bills._id' },
    { key: 'date', label: 'table.bills.date' },
    { key: 'price', label: 'table.bills.price' },
    { key: 'filepath', label: 'table.bills.filepath' },
    { key: 'buyer', label: 'table.bills.buyer' },
    { key: 'receiver', label: 'table.bills.receiver' }
];

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
    <h2 class="title">{{ $t('table.bills.title') }}</h2>
    <AdminTable
        name="bills"
        @search="search"
        @delete="handleDelete"
        :columns="columns"
    />
</template>
