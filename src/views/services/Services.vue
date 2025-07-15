<script setup lang="ts">
import { ref } from 'vue'
import { api, createService, getServices, isSessionValid, saveLocation } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'
import router from '@/router'
import Modal from '@/components/Modal.vue'
import { startSession } from '@/stores/session.ts'
import LocationSelector from '@/components/location/LocationSelector.vue'
import type { Location } from '@/types/location.ts'
import type { Service } from '@/types/service.ts'
import LabelInput from '@/components/LabelInput.vue'

const session = startSession()
api(session)
const loggedIn = ref<boolean>(false)
isSessionValid(false).then((valid: boolean) => loggedIn.value = valid)

const pagination = newPagination()

const services = ref<Service[]>([])
getServices(pagination).then(data => services.value = data)

const name = ref<string>()
const description = ref<string>()
const price = ref<number>(0)
const date = ref<string>()
const location = ref<Location>()

const modal = ref(false)
async function toggleModal() {
    if (loggedIn.value) {
        modal.value = !modal.value
        return
    }
    router.push("/login");
}

async function submit() {
    if (!location.value) return
    if (!location.value._id) {
        saveLocation(location.value).then(loc => {
            location.value = loc;
            askService();
        });
    } else askService();
}

async function askService() {
    if (name.value && description.value && location.value && date.value && date.value) {
        createService(name.value, description.value, price.value, location.value, date.value).then(s => {
            router.push({ path: '/services/' + s._id })
        });
    }
}

</script>

<template>
    <div>
        <button class="button is-primary" @click="toggleModal()">{{ $t("service.request") }}</button>
        <Modal
            :active="modal"
            title="service.request"
            :buttons="{ 'global.confirm': 'primary' }"
            :cancel="true"
            @confirm="submit()"
            @close="toggleModal()"
        >

            <LabelInput v-model="name" :label="$t('service.name')" />

            <div class="field">
                <label class="label">{{ $t('service.description') }}</label>
                <div class="control">
                    <textarea class="textarea" :placeholder="$t('service.description')" v-model="description" />
                </div>
            </div>

            <LabelInput v-model="date" :label="$t('service.date')" type="datetime-local" />
            {{date}}
            <LabelInput v-model="price" :label="$t('service.price')" type="number"/>
            <LocationSelector v-model="location" />

        </Modal>
    </div>

    <article
        class="media has-background-dark p-2"
        v-for="service in services"
        @click="router.push('/services/' + service._id)"
    >
        <figure class="media-left">
            <p class="image is-64x64">
                <img :alt="service.name" src="https://bulma.io/assets/images/placeholders/128x128.png" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <p>
                    {{ service.name }}
                    {{ service.description }}
                </p>
                <p>{{ service.price }}</p>
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
