<script setup lang="ts">
import Folder from '@/components/Folder.vue'
import { VPdfViewer } from '@vue-pdf-viewer/viewer'
import { ref } from 'vue'
import Icon from '@/components/Icon.vue'

const tabs = ["all", "contracts", "finances", "bills"]
const activeTab = ref<string>(tabs[0])
const search = ref<boolean>(false)
const input = ref<string>("")

const products = ['Contracts/2025.pdf', 'Contracts/2024.pdf', 'Finances/Bills/2025-05-22_1.pdf', 'PA/Subject.pdf']
const pdf = ref<string>()
</script>

<template>
    <div class="is-flex is-flex-direction-column-mobile is-justify-content-center is-fullwidth ">
        <div :class="'box' + (pdf && !search ? '' : ' is-halfwidth')">
            <article v-if="search" class="panel is-primary">
                <p class="panel-heading is-flex is-align-items-center control has-icons-right" @click="search=false">
                    {{ $t("user.my-products") }}
                    <Icon icon="fa-close" class="is-right" />
                </p>
                <p class="panel-tabs">
                    <a v-for="tab in tabs" :class="activeTab === tab ? 'is-active' : ''" @click="activeTab = tab">{{ $t("products.tabs." + tab) }}</a>
                </p>
                <div class="panel-block">
                    <p class="control has-icons-left">
                        <input v-model="input" class="input is-primary" type="text" :placeholder="$t('search.products')" />
                        <Icon icon="fa-search" class="is-left" />
                    </p>
                </div>
                <a class="panel-block" v-for="file in products.filter(s => (activeTab === 'all' || s.toLowerCase().includes(activeTab)) && s.toLowerCase().includes(input.toLowerCase()))" @click="pdf = file">
                    <Icon icon="fa-book" class="panel-icon" />
                    {{ file }}
                </a>
            </article>
        </div>
        <div class="is-fullheight is-fullwidth">
            <VPdfViewer v-if="pdf" :src="'http://localhost:3000/data/contracts/' + pdf" />
        </div>
    </div>
</template>

<style scoped>
.is-fullheight {
    height: 75vh;
}
.is-halfwidth {
    width: 50%;
}

@media screen and (max-width: 768px) {
    .is-flex-direction-column-mobile {
        flex-direction: column;
    }
}
</style>
