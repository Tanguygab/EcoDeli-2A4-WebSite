<script setup lang="ts">
import { t } from 'i18next';
import { ref } from 'vue';
import Icon from '../Icon.vue';

const valid = defineModel()
const props = defineProps<{
    keypath?: string,
    name: string,
    type: string,
    icon: string
}>()
defineEmits(["input"])

const path = (props.keypath ? props.keypath : "form") + "." + props.name + "."
function tr(key: string) {
    return t(path + key)
}

const input = ref()

</script>


<template>
    <div class="field">
        <label class="label">{{ tr("label") }}</label>
        <div class="control has-icons-left has-icons-right">
            <input v-model="input" @input="$emit('input', input)"
                :class="'input ' + (valid === undefined ? '' : valid ? 'is-success' : 'is-danger')" :name="name"
                :type="type" :placeholder="tr('placeholder')">

            <Icon :icon="icon" class="is-small is-left" />
            <Icon v-if="valid" icon="fa-check" class="is-small is-right" />
            <Icon v-else-if="valid !== undefined" icon="fa-exclamation-triangle" class="is-small is-right" />
        </div>
        <p v-if="valid !== undefined" :class="'help ' + (valid ? 'is-success' : 'is-danger')">
            {{ tr(valid ? "valid" : "invalid") }}
        </p>
    </div>
</template>