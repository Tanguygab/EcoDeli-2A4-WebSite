<script setup lang="ts">
import type { Product } from '@/types/product.ts'
import { getImageURL } from '@/api.ts'

defineProps<{product: Product}>()

</script>


<template>
    <RouterLink :to="'/product/' + product._id" class="card">
        <div class="card-image">
            <figure class="image">
                <img :src="product.image ? getImageURL(product.image) : 'https://bulma.io/assets/images/placeholders/128x128.png'" :alt="product.name">
            </figure>
        </div>
        <div class="card-content">
            <div class="content">
                <p class="mb-0">
                    {{ product.name }}
                    <br>
                    {{ product.size && product.size.name ? $t("product.size." + product.size.name) : '' }}
                </p>
                <p class="has-text-right">{{ product.price }}€</p>
            </div>
        </div>
    </RouterLink>
</template>

<style scoped>
img {
    width: 128px;
    height: 128px;
}
</style>
