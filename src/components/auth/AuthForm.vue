<script setup lang="ts">
import { ref } from "vue";
import { startSession } from "@/stores/session";
import router from "@/router";
import CustomInput from "./CustomInput.vue";
import { api, isSessionValid, login, register } from "@/api";
import { t } from "i18next";

const props = defineProps<{ isLogin?: boolean }>();

// Démarre session et redirige si déjà connecté
api(startSession());
isSessionValid().then(valid => { if (valid) router.push("/") });

// Variables
const error = ref<string>("");

let email: string = "", password: string = "";
let firstname: string = "", name: string = "", passwordConfirmation: string = "", birthday: string = "";

// Soumission du formulaire
async function submit() {
    if (!validEmail.value || !validPassword.value) return;
    error.value = "";

    try {
        if (!props.isLogin) {
            if (validFirstName.value && validName.value && confirmedPassword.value) {
                await register(firstname, name, email, password, birthday);
                await login(email, password); // auto login après inscription
                router.push("/");
            }
            return;
        }

        await login(email, password);
        router.push("/");
    } catch (e: any) {
        // Gestion explicite des erreurs d'auth
        const msg = e.response?.data?.error?.toLowerCase() || "";
        if (msg.includes("email") || msg.includes("not found")) {
            error.value = "Adresse e-mail introuvable.";
        } else if (msg.includes("password") || msg.includes("incorrect")) {
            error.value = "Mot de passe incorrect.";
        } else {
            error.value = "Une erreur est survenue. Veuillez réessayer.";
        }
    }
}

// Validation des champs
const validEmail = ref<boolean | undefined>();
function checkEmail(value: string) {
    email = value;
    validEmail.value = true;
}

const validFirstName = ref<boolean | undefined>();
function checkFirstName(value: string) {
    firstname = value;
    setTimeout(() => {
        if (firstname !== value) return;
        validFirstName.value = value.trim().toLowerCase() !== "root";
    }, 1000);
}

const validName = ref<boolean | undefined>();
function checkName(value: string) {
    name = value;
    validName.value = true;
}

const validPassword = ref<boolean | undefined>();
function checkPassword(value: string) {
    password = value;
    setTimeout(() => {
        if (password !== value) return;
        validPassword.value = value.length >= 6 && value.length <= 20;
        if (confirmedPassword.value !== undefined) {
            confirmedPassword.value = password === passwordConfirmation;
        }
    }, 1000);
}

const confirmedPassword = ref<boolean | undefined>();
function confirmPassword(value: string) {
    passwordConfirmation = value;
    setTimeout(() => {
        if (passwordConfirmation !== value) return;
        confirmedPassword.value = value === password;
    }, 1000);
}

// Libellés
const label = t("auth." + (props.isLogin ? "login" : "register"));
const label2 = t("auth." + (props.isLogin ? "register" : "login"));
</script>

<template>
    <h1 class="title">{{ label }} :</h1>
    <form @submit.prevent="submit" class="container">
        <p v-if="error" class="has-text-danger">{{ error }}</p>

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
            Pas encore de compte ?
            <RouterLink to="register">{{ label2 }}</RouterLink> plutôt.
        </p>
        <p v-else>Déjà un compte ? <RouterLink to="login">{{ label2 }}</RouterLink> plutôt.</p>
    </form>
</template>

<style scoped>
form {
    width: 50%;
}
.has-text-danger {
    color: red;
    margin-bottom: 1em;
}
</style>
