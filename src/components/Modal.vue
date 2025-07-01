<script setup lang="ts">
defineProps<{ active: boolean, title: string }>();
defineEmits(["confirm", "close"]);
</script>

<template>
    <div :class="'modal' + (active ? ' is-active' : '')">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{ $t(title) }}</p>
                <button class="delete" aria-label="close" @click="$emit('close')"></button>
            </header>
            <section class="modal-card-body">
                <slot></slot>
            </section>
            <footer class="modal-card-foot">
                <div class="buttons">
                    <button class="button is-primary" @click="$emit('confirm')" >{{ $t("global.confirm") }}</button>
                    <button class="button" @click="$emit('close')">{{ $t("global.close") }}</button>
                </div>
            </footer>
        </div>
    </div>
</template>
