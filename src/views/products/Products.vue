<script setup lang="ts">
import { ref } from 'vue'
import type { Product } from '@/types/product.ts'
import { getProducts } from '@/api.ts'
import { newPagination } from '@/types/pagination.ts'
import Pages from '@/components/Pages.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import type { User } from '@/types/user.ts'
import Icon from '@/components/Icon.vue'

const pagination = newPagination()
const products = ref<Product[]>([])

const sellers = ref<User[]>([])
const selectedSellers = ref<User[]>([])
getProducts(pagination).then(data => products.value = data)

const sizes = ['small', 'medium', 'large', 'xxl']
</script>

<template>
    <div class="columns is-fullwidth is-fullheight">
        <nav class="box ml-3 mt-5">
            <div>
                <label class="title is-5">{{ $t('product.price.name') }}</label>
                <div class="control has-icons-right my-3">
                    <input class="input" type="number" :placeholder="$t('product.price.min')" min="0" />
                    <span class="icon is-small is-right">€</span>
                </div>
                <div class="control has-icons-right">
                    <input class="input" type="number" :placeholder="$t('product.price.max')" min="0"/>
                    <span class="icon is-small is-right">€</span>
                </div>

            </div>

            <div class="my-6">
                <label class="title is-5">{{ $t('product.size.name') }}</label>
                <div class="checkboxes is-flex-direction-column mt-3">
                    <label v-for="size in sizes" class="checkbox">
                        <input type="checkbox" />
                        {{ $t('product.size.' + size) }}
                    </label>
                </div>
            </div>

            <div class="content mb-5">
                <label class="title is-5">{{ $t('product.seller') }}</label>
                <div class="control has-icons-left mt-3">
                    <input class="input" type="text" placeholder="Search" />
                    <span class="icon is-left">
                        <i class="fas fa-search" aria-hidden="true"></i>
                      </span>
                </div>
                <ul v-for="(seller, i) in selectedSellers" :key="seller.id">
                    <li>
                        {{ seller.firstname + " " + seller.name }}
                        <Icon icon="fa-trash" @click="selectedSellers.splice(i, 1)"/>
                    </li>
                </ul>
            </div>
        </nav>

        <div class="my-5 is-fullwidth is-flex is-flex-direction-column">
            <div class="is-fullheight">
                <h1 class="title has-text-centered">{{ $t("search.results", {input: pagination.filter}) }}</h1>
                <div class="is-flex is-flex-wrap-wrap is-justify-content-center">
                    <ProductCard
                        class="mx-5"
                        v-for="product in products"
                        :key="product.id"
                        :product="product"
                    />
                    <div></div>
                </div>
            </div>
            <Pages class="mb-auto" :list="products" :pagination="pagination" />
        </div>
    </div>
</template>

<style scoped>
.is-fullheight {
    height: 100%;
}
.is-fullwidth {
    width: 100%;
}
</style>
