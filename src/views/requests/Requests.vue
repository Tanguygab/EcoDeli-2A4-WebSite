<script setup lang="ts">
import { ref } from 'vue'
import type { ProductRequest } from '@/types/product_request.ts'
import { getRequests } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'
import router from '@/router'

const pagination = newPagination()

const requests = ref<ProductRequest[]>([])
getRequests(pagination).then(data => requests.value = data)

</script>

<template>
    <article
        class="media has-background-dark p-2"
        v-for="request in requests"
        @click="router.push('/requests/' + request._id)"
    >
        <figure class="media-left">
            <p class="image is-64x64">
                <img :alt="request.product.name" src="https://bulma.io/assets/images/placeholders/128x128.png" />
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

<style scoped>
article {
    border-radius: 20px;
}
article:hover {
    background-color: black!important;
}
</style>
