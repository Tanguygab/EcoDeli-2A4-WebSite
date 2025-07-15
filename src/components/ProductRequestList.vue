<script setup lang="ts">
import type { ProductRequest } from '@/types/product_request.ts'
import router from '@/router'

defineProps<{ requests: ProductRequest[] }>();
</script>

<template>
    <article
        class="media has-background-dark p-2 mt-5"
        v-for="request in requests"
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
