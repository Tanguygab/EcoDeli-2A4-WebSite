<script setup lang="ts">
import { startSession } from '@/stores/session.ts'
import {
    api,
    endDelivery,
    getDelivery,
    getDeliveryStatuses,
    isSessionValid,
    loadPage,
    setRequestStatus,
    startDelivery
} from '@/api.ts'
import { ref } from 'vue'
import router from '@/router'
import type { Delivery } from '@/types/delivery.ts'
import type { ProductRequest } from '@/types/product_request.ts'
import ElementList from '@/components/ElementList.vue'
import Modal from '@/components/Modal.vue'
import type { DeliveryStatus } from '@/types/delivery_status.ts'

const session = startSession()
api(session)
isSessionValid(true)

const delivery = ref<Delivery | undefined>(undefined)
loadPage(delivery, getDelivery)

function get(prop: any) {
    return prop.element as ProductRequest
}

async function start() {
    if (delivery.value?._id != null && await startDelivery(delivery.value?._id)) {
        delivery.value.status = 'ongoing';
        (delivery.value.products as ProductRequest[])
            .forEach((request: ProductRequest) => request.delivery_status = statuses.value
                .find(status => status.name == 'ongoing'))
    }
}
async function end() {
    if (delivery.value?._id != null && await endDelivery(delivery.value?._id)) {
        delivery.value.status = 'done';
        (delivery.value.products as ProductRequest[])
            .forEach((request: ProductRequest) => {
                if (!request.delivery_status) request.delivery_status = statuses.value
                    .find(status => status.name == 'not-delivered')
            })
    }
}

const statuses = ref<DeliveryStatus[]>([])
getDeliveryStatuses().then(data => statuses.value = data)

const selectedRequest = ref<ProductRequest>()
const selectedStatus = ref<DeliveryStatus>()
function setStatus() {
    if (!selectedRequest.value || !selectedStatus.value) return
    setRequestStatus(selectedRequest.value, selectedStatus.value)
    selectedRequest.value.delivery_status = selectedStatus.value
    closeModal()
}
function closeModal() {
    selectedRequest.value = undefined
    selectedStatus.value = undefined
}

</script>

<template>
    <template v-if="delivery">
        <Modal
            title="request.set-status"
            :active="selectedRequest != null"
            @confirm="setStatus"
            @close="closeModal"
        >
            <ElementList :array="statuses" v-slot="prop" @click="element => selectedStatus = element">
                <div :class="selectedStatus === prop.element ? 'has-text-danger' : ''">
                    {{ (prop.element as DeliveryStatus).name }}
                </div>
            </ElementList>
        </Modal>

        <div class="is-flex">
            <RouterLink class="button is-info mr-4" to="/deliverymen/requests">{{ $t('delivery.add-request') }}</RouterLink>
            <button v-if="!delivery.status" @click="start" class="button is-success">{{ $t("delivery.start") }}</button>
            <button v-else-if="delivery.status == 'ongoing'" @click="end" class="button is-danger">{{ $t("delivery.stop") }}</button>
            <button v-else class="button is-primary" disabled>{{ $t("delivery.done") }}</button>
        </div>
        <ElementList
            :array="delivery.products as ProductRequest[]"
            v-slot="prop"
            @click="(element) => router.push('/requests/' + element._id)"
        >
            <div class="is-flex">
                <div>
                    <span v-if="get(prop).delivery_status && delivery.status" :class="'tag mr-3 is-' + get(prop).delivery_status?.color">
                        {{ $t("requests.status." + get(prop).delivery_status?.name) }}
                    </span>
                    <p>{{ get(prop).product.name }} x{{ get(prop).amount }}</p>
                    <p>{{ get(prop).product.price * get(prop).amount }}</p>
                </div>
                <button v-if="delivery.status === 'ongoing'" @click.stop="selectedRequest = get(prop)" class="button is-info">{{ $t("requests.set-status") }}</button>
            </div>

        </ElementList>
    </template>
</template>
