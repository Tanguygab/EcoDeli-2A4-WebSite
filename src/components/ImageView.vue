<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ image?: string, size?: number, text: string, link?: string, overlay?: boolean }>()
const img = ref()

if (props.image) {
    import(/* @vite-ignore */ "/src/assets/" + props.image).then(image => {
        img.value.src = image.default
    })
}
</script>

<template>
    <figure :class="'image' + (overlay ? '' : ' is-flex is-flex-direction-column is-align-items-center')">
        <img ref="img" :style="(size ? 'width: ' + size + 'em' : '')" src="https://bulma.io/assets/images/placeholders/1280x960.png" />
        <figcaption
            :class="'is-flex is-justify-content-center mt-' + (overlay ? '5 is-align-items-start is-overlay' : '3')">
            <a v-if="link" :href="link" class="button is-rounded is-primary">
                {{ text }}
            </a>
            <p v-else>{{ text }}</p>
        </figcaption>
    </figure>
</template>

<style scoped>
img {
    border-radius: 5%;
}

p {
    text-align: center;
}
</style>
