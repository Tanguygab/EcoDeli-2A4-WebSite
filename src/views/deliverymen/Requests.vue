<script setup lang="ts">
import { ref } from 'vue'
import type { ProductRequest } from '@/types/product_request.ts'
import { acceptProductRequest, getUnassignedRequests, getDeliveries } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'
import router from '@/router'
import ElementList from '@/components/ElementList.vue'
import type { Delivery } from '@/types/delivery.ts'
import Modal from '@/components/Modal.vue'

const pagination = newPagination()

const requests = ref<ProductRequest[]>([])
getUnassignedRequests(pagination).then(data => requests.value = data)

function getR(prop: any) {
    return prop.element as ProductRequest
}

const deliveries = ref<Delivery[]>([])
getDeliveries(pagination).then(data => deliveries.value = data)

function getD(prop: any) {
    return prop.element as Delivery
}

const request = ref<ProductRequest | undefined>()
const delivery = ref<Delivery | undefined>()

async function addRequestToDelivery() {
    if (!request.value || !delivery.value) return
    acceptProductRequest(request.value, delivery.value)
    requests.value = requests.value.splice(deliveries.value.indexOf(delivery.value), 1)
    closeModal()
}

function closeModal() {
    request.value = undefined
    delivery.value = undefined

}

</script>

<template>
    <Modal
        title="request.add-to-delivery"
        :active="request !== undefined"
        @confirm="addRequestToDelivery"
        @close="closeModal"
    >
        <ElementList
            :array="deliveries"
            v-slot="prop"
            @click="element => delivery = element"
        >
            <div :class="'is-flex is-justify-content-space-between' + (prop.element === delivery ? ' has-text-danger' : '')">
                <div>
                    <p>
                        {{ getD(prop).products }} products
                    </p>
                    <p>
                        {{ new Date(getD(prop).first_product_date).toLocaleString() }}
                        -
                        {{ new Date(getD(prop).last_product_date).toLocaleString() }}
                    </p>
                </div>
                <button class="button is-primary">Select</button>
            </div>

        </ElementList>
    </Modal>
    <ElementList
        :array="requests"
        v-slot="prop"
        @click="element => router.push('/requests/' + element._id)"
    >
        <div class="is-flex">
            <div>
                <p>{{ getR(prop).product.name }} x{{ getR(prop).amount }}</p>
                <p>{{ getR(prop).product.price * getR(prop).amount }}</p>
            </div>
            <button class="button is-primary" @click.stop="request = getR(prop)">Add to Delivery</button>
        </div>

    </ElementList>
</template>

<style scoped>
article {
    border-radius: 20px;
}
article:hover {
    background-color: black!important;
}
</style>
