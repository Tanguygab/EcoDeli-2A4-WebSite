<script setup lang="ts">
import type { Product } from '@/types/product.ts'

defineProps<{product: Product}>()

</script>


<template>
    <div class="card">
        <div class="card-image">
            <figure class="image">
                <img src="https://bulma.io/assets/images/placeholders/128x128.png" :alt="product.name">
            </figure>
        </div>
        <div class="card-content">
            <div class="content">
                <p class="mb-0">
                    {{ product.name }}
                    <br>
                    {{ $t("product.size." + product.size.name) }}
                </p>
                <p class="has-text-right">{{ product.price }}€</p>
            </div>
        </div>
    </div>
</template>
