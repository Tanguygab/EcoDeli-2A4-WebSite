<script setup lang="ts">
import { startSession } from '@/stores/session'
import { api, getService, isSessionValid, loadPage } from '@/api'
import { ref } from 'vue'
import type { Service } from '@/types/service.ts'

const session = startSession()
api(session)
isSessionValid(true)

const service = ref<Service | undefined>(undefined)
loadPage(service, getService)
</script>

<template>
    <template v-if="service && service.user">
        <div class="is-flex">
            <figure class="image is-1by1 is-fullwidth mr-5 mt-5">
                <img :alt="service.name" src="https://bulma.io/assets/images/placeholders/256x256.png">
            </figure>
            <div>
                <h1 class="title">{{ service.name }}</h1>

                {{ $t('service.requester') }}:
                <RouterLink class="link" :to="'/profile/' + service.user._id">
                    {{ service.user.firstname + ' ' + service.user.name }}
                </RouterLink>

                <br />
                {{ $t('product.price.name') }}: {{ service.price }}€


            </div>
        </div>
    </template>
</template>

<style scoped>
.is-1by1 {
    width: 30em;
}
</style>
