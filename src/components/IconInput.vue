<script setup lang="ts">
const model = defineModel();
defineProps<{
    placeholder: string,
    type?: string,
    icon: string,
    minlength?: number,
    maxlength?: number,
}>();
</script>

<template>
    <div class="field">
        <p class="control has-icons-left">
            <input
                v-model="model"
                class="input"
                :type="type ?? 'text'"
                :placeholder="placeholder"
                :minlength="minlength"
                :maxlength="maxlength"
            />
            <span class="icon is-small is-left">
                <i :class="'fas ' + icon"></i>
            </span>
        </p>
    </div>
</template>
