<script setup lang="ts">
import AdminTable from '@/components/AdminTable.vue';
import type { Pagination } from '@/types/pagination';
import type { Bill } from '@/types/bill';
import { getBills, deleteBill } from '@/api';

async function search(pagination: Pagination, callback: (updatedList: Array<any>) => void) {
    //callback(await getBills(pagination))
    callback([
        { id: 1, date: new Date("2024-03-15"), price: 150, filepath: "facture1.pdf", buyer: undefined, receiver: undefined },
        { id: 2, date: new Date("2024-02-10"), price: 200, filepath: "facture2.pdf", buyer: undefined, receiver: undefined },
    ])
}

async function handleDelete(bill: Bill, callback: () => void) {
    try {
        //await deleteBill(bill)
        callback()
    } catch (e) { }
}
</script>

<template>
    <h2 class="title">Gestion des Factures</h2>
    <AdminTable name="bills" @search="search" @delete="handleDelete" :columns="['id', 'date', 'price']" />
</template>
