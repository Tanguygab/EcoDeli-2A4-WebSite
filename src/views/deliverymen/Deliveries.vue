<script setup lang="ts">
import { ref } from 'vue'
import type { Delivery } from '@/types/delivery'
import { createDelivery, getDeliveries } from '@/api'
import { newPagination } from '@/types/pagination'
import router from '@/router'

const pagination = newPagination()

const deliveries = ref<Delivery[]>([])
getDeliveries(pagination).then(data => deliveries.value = data)

async function newDelivery() {
  createDelivery().then(delivery => router.push('/deliverymen/deliveries/' + delivery._id))
}

</script>

<template>
    <button class="button mb-5" @click="newDelivery">New Delivery</button>
    <article
        class="media has-background-dark p-2"
        v-for="delivery in deliveries"
        @click="router.push('/deliverymen/deliveries/' + delivery._id)"
    >
        <figure class="media-left">
            <p class="image is-64x64">
                <img alt="A delivery" src="https://bulma.io/assets/images/placeholders/128x128.png" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <p>
                    {{ delivery.products }} products
                </p>
                <p>
                  {{ new Date(delivery.first_product_date).toLocaleString() }}
                  -
                  {{ new Date(delivery.last_product_date).toLocaleString() }}
                </p>
            </div>
        </div>
    </article>
</template>

<style scoped>
article {
    border-radius: 20px;
}
article:hover {
    background-color: black!important;
}
</style>
