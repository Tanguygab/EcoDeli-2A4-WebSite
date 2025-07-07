<script setup lang="ts">
const model = defineModel();
defineProps<{
    label: string
    placeholder?: string,
    type?: string,
}>();
</script>

<template>
    <div class="field is-horizontal">
        <div class="field-label is-normal">
            <label class="label">{{ label }}</label>
        </div>
        <div class="field-body">
            <div class="field">
                <div class="control">
                    <input v-model="model" class="input" :type="type ?? 'text'" :placeholder="placeholder ?? label">
                </div>
            </div>
        </div>
    </div>
</template>
