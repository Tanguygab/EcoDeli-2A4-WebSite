<script setup lang="ts">
import { startSession } from '@/stores/session'
import { api, getProduct } from '@/api'
import { ref, watch } from 'vue'
import router from '@/router'
import type { Product } from '@/types/product.ts'

const session = startSession()
api(session)

const product = ref<Product | undefined>(undefined)

async function loadProduct() {
    const id = router.currentRoute.value.params.id as string
    if (id) getProduct(parseInt(id))
        .then(p => product.value = p)
        .catch(() => router.push("/"))
    else router.push("/")
}

watch(() => router.currentRoute.value.params, loadProduct)
loadProduct()
</script>

<template>
    <template v-if="product">
        {{ product.name }}

    </template>

</template>

<style scoped>

</style>
