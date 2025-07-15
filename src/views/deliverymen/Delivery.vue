<script setup lang="ts">
import { startSession } from '@/stores/session.ts'
import { api, getDelivery, isSessionValid, loadPage } from '@/api.ts'
import { ref } from 'vue'
import router from '@/router'
import type { Delivery } from '@/types/delivery.ts'
import type { ProductRequest } from '@/types/product_request.ts'
import ElementList from '@/components/ElementList.vue'

const session = startSession()
api(session)
isSessionValid(true)

const delivery = ref<Delivery | undefined>(undefined)
loadPage(delivery, getDelivery)

function get(prop: any) {
    return prop.element as ProductRequest
}
</script>

<template>
    <template v-if="delivery">
        <RouterLink class="button" to="/deliverymen/requests">Add Product Request</RouterLink>
        <ElementList
            :array="delivery.products as ProductRequest[]"
            v-slot="prop"
            @click="element => router.push('/requests/' + element._id)"
        >
            <p>{{ get(prop).product.name }} x{{ get(prop).amount }}</p>
            <p>{{ get(prop).product.price * get(prop).amount }}</p>
        </ElementList>
    </template>
</template>
