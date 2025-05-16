<script setup lang="ts">
import { startSession } from '@/stores/session'
import { api, getUser, isSessionValid } from '@/api'
import { ref, watch } from 'vue'
import router from '@/router'
import type { User } from '@/types/user'

const session = startSession()
api(session)

const user = ref<User | undefined>(undefined)

async function loadUser() {
    const id = router.currentRoute.value.params.id as string
    if (id) getUser(parseInt(id))
        .then(u => user.value = u)
        .catch(() => router.push("/"))
    else if (await isSessionValid(true)) user.value = session.user!!
}

watch(() => router.currentRoute.value.params, loadUser)
loadUser()

</script>

<template>
    <template v-if="user">
        <div class="columns">

            <figure class="column is-one-third is-flex is-flex-direction-column is-align-items-center has-text-centered">
                <img alt="Profile Picture" src="@/assets/pedro.png">
                <figcaption class="title is-4">
                    <span v-if="user.role.name !== 'user'" :class="'tag' + (user.role.name === 'admin' ? ' is-danger' : '')">
                        {{ $t("user.role." + user.role.name) }}
                    </span>
                    <span v-if="user.subscription.name !== 'free'" :class="'tag ml-2 is-' + user.subscription.color">
                        {{ $t("user.subscription." + user.subscription.name) }}
                    </span>
                    <br>
                    {{ user.firstname + " " + user.name }}

                </figcaption>
            </figure>
            <div class="column mt-5">
                <h2>Description</h2>
                <p class="mt-5">{{ user.description ? user.description : $t("user.no-description") }}</p>
            </div>
        </div>
        <div class="mt-5 columns has-text-centered is-8">
            <div class="column box">
                <h1 class="title is-1">16</h1>
                <h2 class="subtitle">Livraisons effectuées</h2>
            </div>
            <div class="column box">
                <h2 class="subtitle">Noté</h2>
                <h1 class="title is-1">4.7⭐</h1>
                <h2 class="subtitle">/5</h2>
            </div>
            <div class="column box">
                <h1 class="title is-1">16</h1>
                <h2 class="subtitle">Livraisons effectuées</h2>
            </div>
            <div></div>
        </div>
    </template>
</template>

<style scoped>
.columns {
    width: 100%;
}

img {
    width: 20em;
}
</style>
