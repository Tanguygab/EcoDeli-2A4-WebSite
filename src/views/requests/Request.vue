<script setup lang="ts">
import { startSession } from '@/stores/session'
import { api, getRequest, isSessionValid, loadPage } from '@/api'
import { ref } from 'vue'
import type { ProductRequest } from '@/types/product_request.ts'
import MapView from '@/components/MapView.vue'

const session = startSession()
api(session)
isSessionValid(true)

const request = ref<ProductRequest | undefined>(undefined)
loadPage(request, getRequest)
</script>

<template>
    <template v-if="request">
        <div class="is-flex">
            <figure class="image is-1by1 is-fullwidth mr-5 mt-5">
                <img :alt="request.product.name" src="https://bulma.io/assets/images/placeholders/256x256.png">
            </figure>
            <div>
                <h1 class="title">{{ request.product.name }}</h1>
                <h6 class="title is-6" v-if="request.delivery_status">
                    {{ $t("delivery.status." +request.delivery_status.name) }}
                </h6>

                {{ $t('product.seller') }}:
                <RouterLink class="link" :to="'/profile/' + request.product.seller._id">
                    {{ request.product.seller.firstname + ' ' + request.product.seller.name }}
                </RouterLink>

                <br>
                {{ $t('product.price.name') }}: {{ request.product.price }}€


            </div>
        </div>
        <div class="mt-5" v-if="request.delivery && request.delivery_status?.name === 'ongoing'">
            <h1 class="title is-6 has-text-centered">
                Delivery Status
            </h1>
            <MapView :lat="request.delivery.latitude" :lon="request.delivery.longitude"/>
        </div>
    </template>
</template>

<style scoped>
.is-1by1 {
    width: 30em;
}
</style>
