<script setup lang="ts">
import { ref } from "vue";
import { startSession } from "@/stores/session";
import router from "@/router";
import CustomInput from "./CustomInput.vue";
import { api, isSessionValid, login, register } from "@/api"
import { t } from "i18next";

const props = defineProps<{ isLogin?: boolean }>();

api(startSession())
isSessionValid().then(valid => { if (valid) router.push("/") });

const error = ref<string>("");

const email = ref<string>("");
const username = ref<string>("");
const password = ref<string>("");

async function submit() {
    error.value = "";

    try {
        if (props.isLogin) login(email.value, password.value)
        else register(email.value, username.value, password.value)
    } catch (e: any) {
        error.value = e.response.data.error
    }
}

let typing = "";

const validEmail = ref<boolean | undefined>()
function checkEmail(value: String) {

}
const validFirstName = ref<boolean | undefined>()
function checkFirstName(value: string) {
    typing = value
    setTimeout(() => {
        if (typing !== value) return
        validFirstName.value = value === "Tanguy"
    }, 1000);
}

const validName = ref<boolean | undefined>()
function checkName(value: string) {
}

const validPassword = ref<boolean | undefined>()
function checkPassword(value: String) {

}

const label = t("auth." + (props.isLogin ? "login" : "register"))

</script>

<template>
    <h1 class="title">{{ label }}:</h1>
    <form @submit.prevent="submit" class="container">
        <p>{{ error }}</p>

        <CustomInput v-if="!isLogin" v-model="validFirstName" keypath="form" name="firstname" type="text" icon="fa-user"
            @input="checkFirstName" />
        <CustomInput v-if="!isLogin" v-model="validName" keypath="form" name="name" type="text" icon="fa-user"
            @input="checkName" />
        <CustomInput v-model="validEmail" keypath="form" name="email" type="email" icon="fa-envelope"
            @input="checkEmail" />
        <CustomInput v-model="validPassword" keypath="form" name="password" type="password" icon="fa-lock"
            @input="checkPassword" />
        <input class="button is-link" type="submit" :value="label">

        <p v-if="isLogin">No account? <RouterLink to="register">{{ $t("auth." + props.isLogin ? "register" : "login") }}
            </RouterLink> instead.</p>
        <p v-else>Already have an account? <RouterLink to="login">{{ label }}</RouterLink> instead.</p>
    </form>
</template>

<style scoped>
form {
    width: 50%;
}
</style>