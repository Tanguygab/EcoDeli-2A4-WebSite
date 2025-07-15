<script setup lang="ts">
import { ref } from "vue";
import emailjs from "emailjs-com";

const firstname = ref("");
const lastname = ref("");
const email = ref("");
const demande = ref("");
const sent = ref(false);

async function sendMail() {
    if (!firstname.value || !lastname.value || !email.value || !demande.value) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // Les clés doivent correspondre à celles du template EmailJS
    const templateParams = {
        from_name: `${firstname.value} ${lastname.value}`,
        from_email: email.value,
        message: demande.value
    };

    try {
        await emailjs.send(
            "service_xxxxx",    // Ton vrai Service ID
            "template_xxxxx",   // Ton vrai Template ID
            templateParams,
            "public_xxxxx"      // Ta vraie Public Key
        );
        sent.value = true;
    } catch (err) {
        alert("Erreur lors de l'envoi du mail.");
        console.error(err);
    }
}
</script>

<template>
    <h1 class="title">Contact</h1>
    <form v-if="!sent" @submit.prevent="sendMail" class="container">
        <div class="field">
            <label class="label">Nom</label>
            <div class="control">
                <input class="input" type="text" v-model="lastname" required />
            </div>
        </div>
        <div class="field">
            <label class="label">Prénom</label>
            <div class="control">
                <input class="input" type="text" v-model="firstname" required />
            </div>
        </div>
        <div class="field">
            <label class="label">Email</label>
            <div class="control">
                <input class="input" type="email" v-model="email" required />
            </div>
        </div>
        <div class="field">
            <label class="label">Demande</label>
            <div class="control">
                <textarea class="textarea" v-model="demande" required></textarea>
            </div>
        </div>
        <input class="button is-link" type="submit" value="Envoyer">
    </form>
    <div v-else class="has-text-centered is-size-4 has-text-success">
        Mail envoyé !
    </div>
</template>

<style scoped>
form {
    width: 50%;
    margin: auto;
}
</style>