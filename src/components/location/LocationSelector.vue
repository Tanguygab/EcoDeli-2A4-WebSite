<script setup lang="ts">
import { ref } from 'vue'
import type { Location } from '@/types/location.ts'
import { getLocations } from '@/api.ts'
import LocationSaver from '@/components/location/LocationSaver.vue'

const location = defineModel<Location | undefined>()
const newLocation = ref<Location>({city: "", address: "", zipcode: ""})

const locations = ref<Location[]>([])
getLocations().then(locs => locations.value = locs);
</script>

<template>
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
        <LocationSaver v-model="newLocation" />
    </div>
</template>
