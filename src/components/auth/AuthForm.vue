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

let email: string = "", password: string = "";
let firstname: string = "", name: string = "", passwordConfirmation: string = "", birthday: string = "";

async function submit() {
    if (!validEmail || !validPassword) return
    error.value = "";

    try {
        if (!props.isLogin) {
            if (validFirstName && validName && confirmedPassword)
                register(firstname, name, email, password, birthday)
            return
        }
        login(email, password)
    } catch (e: any) {
        error.value = e.response.data.error
    }
}


const validEmail = ref<boolean | undefined>()
function checkEmail(value: string) {
    email = value
}
const validFirstName = ref<boolean | undefined>()
function checkFirstName(value: string) {
    firstname = value
    setTimeout(() => {
        if (firstname !== value) return
        validFirstName.value = value === "Tanguy"
    }, 1000);
}

const validName = ref<boolean | undefined>()
function checkName(value: string) {
    name = value
}

const validPassword = ref<boolean | undefined>()
function checkPassword(value: string) {
    password = value
    setTimeout(() => {
        if (password !== value) return
        validPassword.value = value.length >= 6 && value.length <= 20
        if (confirmedPassword.value !== undefined)
            confirmedPassword.value = password === passwordConfirmation
    }, 1000);
}

const confirmedPassword = ref<boolean | undefined>()
function confirmPassword(value: string) {
    passwordConfirmation = value
    setTimeout(() => {
        if (passwordConfirmation !== value) return
        confirmedPassword.value = value === password
    }, 1000);
}

const label = t("auth." + (props.isLogin ? "login" : "register"))
const label2 = t("auth." + (props.isLogin ? "register" : "login"))

</script>

<template>
    <h1 class="title">{{ label }}:</h1>
    <form @submit.prevent="submit" class="container">
        <p>{{ error }}</p>

        <div v-if="!isLogin" class="field is-grouped">
            <CustomInput v-model="validFirstName" name="firstname" type="text" icon="fa-user" @input="checkFirstName" />
            <CustomInput v-model="validName" name="name" type="text" icon="fa-user" @input="checkName" />
        </div>
        <CustomInput v-model="validEmail" name="email" type="email" icon="fa-envelope" @input="checkEmail" />
        <CustomInput v-model="validPassword" name="password" type="password" icon="fa-lock" @input="checkPassword" />
        <template v-if="!isLogin">
            <CustomInput v-model="confirmedPassword" name="confirm" type="password" icon="fa-lock"
                @input="confirmPassword" />

            <CustomInput name="birthday" type="date" icon="fa-birthday-cake" @input="value => birthday = value" />
        </template>

        <input class="button is-link" type="submit" :value="label">

        <p v-if="isLogin">
            No account?
            <RouterLink to="register">{{ label2 }}</RouterLink>
            instead.
        </p>
        <p v-else>Already have an account? <RouterLink to="login">{{ label2 }}</RouterLink> instead.</p>
    </form>
</template>

<style scoped>
form {
    width: 50%;
}
</style>