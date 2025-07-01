<script setup lang="ts">
import { startSession } from '@/stores/session'
import { api, buyProduct, getLocations, getProduct, isSessionValid, loadPage, saveLocation } from '@/api'
import { ref } from 'vue'
import type { Product } from '@/types/product.ts'
import Modal from '@/components/Modal.vue'
import type { Location } from '@/types/location.ts'
import IconInput from '@/components/IconInput.vue'
import router from '@/router'

const session = startSession()
api(session)
const loggedIn = ref<boolean>(false)
isSessionValid(false).then((valid: boolean) => loggedIn.value = valid)

const product = ref<Product | undefined>(undefined)
loadPage(product, getProduct)

const location = ref<Location | undefined>(undefined)
const newLocation = ref<Location>({city: "", address: "", zipcode: ""})

const locations = ref<Location[]>([])
getLocations().then(locs => locations.value = locs);

const buyModal = ref(false)
async function toggleBuyModal() {
    if (loggedIn.value) {
        buyModal.value = !buyModal.value
        return
    }
    router.push("/login");
}

async function submit() {
    if (location.value === newLocation.value) {
        saveLocation(newLocation.value).then(loc => {
            location.value = loc;
            buy();
        });
    } else buy();
}

async function buy() {
    if (product.value && location.value) {
        buyProduct(product.value, amount.value, location.value).then(() => {
            router.push({ path: '/purchases' })
        });
    }
}


const amount = ref(1);

</script>

<template>
    <template v-if="product">
        <div class="is-flex">
            <figure class="image is-1by1 is-fullwidth mr-5 mt-5">
                <img :alt="product.name" src="https://bulma.io/assets/images/placeholders/256x256.png">
            </figure>
            <div>
                <h1 class="title">{{ product.name }}</h1>

                {{ $t('product.seller') }}:
                <RouterLink class="link" :to="'/profile/' + product.seller._id">
                    {{ product.seller.firstname + ' ' + product.seller.name }}
                </RouterLink>

                <br />
                {{ $t('product.price.name') }}: {{ product.price }}€

                <div>
                    <button class="button is-primary" @click="toggleBuyModal()">{{ $t("product.buy") }}</button>
                    <Modal
                        :active="buyModal"
                        title="product.buy"
                        :buttons="{ 'global.confirm': 'primary' }"
                        :cancel="true"
                        @confirm="submit()"
                        @close="toggleBuyModal()"
                    >
                        <div class="field is-horizontal">
                            <div class="field-label is-normal">
                                <label class="label">{{ $t("product.count") }}</label>
                            </div>
                            <div class="field-body">
                                <div class="field">
                                    <div class="control">
                                        <input v-model="amount" class="input" type="number" :placeholder="$t('product.amount')">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="control has-icons-left">
                            <div class="select">
                                <select v-model="location">
                                    <option :value="undefined" selected>Select a location</option>
                                    <option :value="newLocation">New</option>
                                    <option v-for="location in locations" :value="location">
                                        {{ location.address + ", " + location.city + " (" + location.zipcode + ")" }}
                                    </option>
                                </select>
                            </div>
                            <span class="icon is-left">
                                <i class="fas fa-globe"></i>
                            </span>
                        </div>

                        <div v-if="location === newLocation" class="mt-3 mx-6">
                            <IconInput v-model="newLocation.address" placeholder="Address" icon="fa-address-card" />
                            <div class="field is-horizontal">
                                <div class="field-body">
                                    <IconInput v-model="newLocation.city" placeholder="City" icon="fa-city" />
                                    <IconInput
                                        v-model="newLocation.zipcode"
                                        placeholder="Zipcode"
                                        icon="fa-address-card"
                                        type="number"
                                        :minlength="5"
                                        :maxlength="5"
                                    />
                                </div>
                            </div>
                        </div>

                        <br>
                        <h5 class="title is-5">
                            {{ $t("global.total") }} {{ product.price * amount }}€
                        </h5>

                    </Modal>
                </div>


            </div>
        </div>
    </template>
</template>

<style scoped>
.is-1by1 {
    width: 30em;
}
</style>
