<script setup lang="ts">
import { startSession } from '@/stores/session.ts'
import { api, getDelivery, isSessionValid, loadPage } from '@/api.ts'
import { ref } from 'vue'
import router from '@/router'
import type { Delivery } from '@/types/delivery.ts'
import type { ProductRequest } from '@/types/product_request.ts'

const session = startSession()
api(session)
isSessionValid(true)

const delivery = ref<Delivery | undefined>(undefined)
loadPage(delivery, getDelivery)

async function addRequest() {

}

</script>

<template>
    <template v-if="delivery">
        <button class="button" @click="addRequest">Add Product Request</button>
        <article
            class="media has-background-dark p-2 mt-5"
            v-for="request in delivery.products as ProductRequest[]"
            @click="router.push('/deliverymen/deliveries/' + request._id)"
        >
            <figure class="media-left">
                <p class="image is-64x64">
                    <img alt="A delivery" src="https://bulma.io/assets/images/placeholders/128x128.png" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <p>
                        {{ request.product.name }} x{{ request.amount }}
                    </p>
                    <p>{{ request.product.price * request.amount }}</p>
                </div>
            </div>
        </article>
    </template>
</template>
