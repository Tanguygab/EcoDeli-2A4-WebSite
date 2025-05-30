<script setup lang="ts">
import { ref } from "vue";
import {t} from "i18next";

const firstname = ref("");
const lastname = ref("");
const email = ref("");
const demande = ref("");
const fileName = ref("");
const file = ref<File | null>(null);

function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        file.value = target.files[0];
        fileName.value = target.files[0].name;
    } else {
        file.value = null;
        fileName.value = "";
    }
}

function submit() {
    if (!firstname.value || !lastname.value || !email.value || !demande.value) {
        alert(t("contact.required"));
        return;
    }
    alert(
        `${t("contact.lastname")}: ${lastname.value}\n${t("contact.firstname")}: ${firstname.value}\n${t("contact.email")}: ${email.value}\n${t("contact.request")}: ${demande.value}\n${t("contact.file")}: ${fileName.value || t("contact.no-file")}`
    );
}
</script>

<template>
    <h1 class="title">{{ $t('contact.title') }}</h1>
    <form @submit.prevent="submit" class="container">
        <div class="field">
            <label class="label">{{ $t('contact.lastname') }}</label>
            <div class="control">
                <input class="input" type="text" v-model="lastname" required />
            </div>
        </div>
        <div class="field">
            <label class="label">{{ $t('contact.firstname') }}</label>
            <div class="control">
                <input class="input" type="text" v-model="firstname" required />
            </div>
        </div>
        <div class="field">
            <label class="label">{{ $t('contact.email') }}</label>
            <div class="control">
                <input class="input" type="email" v-model="email" required />
            </div>
        </div>
        <div class="field">
            <label class="label">{{ $t('contact.request') }}</label>
            <div class="control">
                <textarea class="textarea" v-model="demande" required></textarea>
            </div>
        </div>
        <div class="file is-centered is-boxed is-success has-name">
            <label class="file-label">
                <input class="file-input" type="file" @change="handleFileChange" />
                <span class="file-cta">
                    <span class="file-icon">
                        <i class="fas fa-upload"></i>
                    </span>
                    <span class="file-label">{{ t('contact.file') }}</span>
                </span>
                <span class="file-name">{{ fileName || t('contact.no-file') }}</span>
            </label>
        </div>
        <input class="button is-link" type="submit" :value="t('contact.send')">
    </form>
</template>

<style scoped>
form {
    width: 50%;
    margin: auto;
}
</style>