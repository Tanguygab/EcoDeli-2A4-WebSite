<script setup lang="ts">
defineProps<{array: Array<any>}>()
defineEmits<{(e: 'click', element: any): void}>()
</script>
<template>
    <article
        class="media has-background-dark p-2 mt-5"
        v-for="element in array"
        @click="$emit('click',element)"
    >
        <figure class="media-left">
            <p class="image is-64x64">
                <img alt="A delivery" src="https://bulma.io/assets/images/placeholders/128x128.png" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <slot :element="element"></slot>
            </div>
        </div>
    </article>
</template>
