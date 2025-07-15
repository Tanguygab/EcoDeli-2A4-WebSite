<script setup lang="ts">
import IconInput from '@/components/IconInput.vue'
import type { Location } from '@/types/location.ts'

const location = defineModel<Location>({default: {city: "", address: "", zipcode: ""}})
</script>

<template>
    <IconInput v-model="location.address" placeholder="Address" icon="fa-address-card" />
    <div class="field is-horizontal">
        <div class="field-body">
            <IconInput v-model="location.city" placeholder="City" icon="fa-city" />
            <IconInput
                v-model="location.zipcode"
                placeholder="Zipcode"
                icon="fa-address-card"
                type="number"
                :minlength="5"
                :maxlength="5"
            />
        </div>
    </div>
</template>
