<script setup lang="ts">
import { api, getNotifications, readNotification } from '@/api';
import router from '@/router';
import { startSession } from '@/stores/session';
import type { Notification } from '@/types/notification';
import { ref } from 'vue';

api(startSession())

const notifications = ref<Notification[]>([
    { id: 0, content: "Titouan purchased your product!", date: new Date(1), is_read: true, link: "profile/titouan.melchio" },
    { id: 1, content: "Abdoullah is selling a new product!", date: new Date(2), is_read: false, link: "/product/123" },
    { id: 2, content: "You've got a new review on your profile!", date: new Date(), is_read: false, link: "/profile" }
])
// getNotifications().then(notifs => notifications.value = notifs)
notifications.value.sort((a, b) => b.date.getTime() - a.date.getTime())

function read(notification?: Notification) {
    readNotification(notification).then(n => { if (n) notifications.value = n })
    if (notification) {
        notification.is_read = true
        if (notification.link) router.push(notification.link)
    }
}

</script>

<template>
    <button class="button is-info" @click="read()">Read All</button>
    <div class="container mt-5">
        <a :class="'box has-background-info-' + (notification.is_read ? '15' : '80')"
            v-for="notification in notifications" @click="read(notification)">
            <small class="tag">{{ notification.date.toDateString() }}</small>
            <p>{{ notification.content }}</p>
        </a>
    </div>

</template>

<style scoped></style>