<script setup lang="ts">
import { ref, watch } from 'vue'
import { Terminal } from '@xterm/xterm'

const connected = ref(false)
const ip = ref()
const password = ref()
let input = ""

function connect() {
    connected.value = true
}
const term = new Terminal()
const shell = ref<HTMLDivElement>()
watch(shell, div => {
    if (div) {
        term.open(div)
        term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
        term.onData(data => {
            if (data === "\r") {
                console.log(input)
                input = ""
                data += "\n"
            } else input += data
            term.write(data)
        })
    }
})
</script>

<template>
    <div v-if="true" ref="shell"></div>

    <form v-else class="form" @submit.prevent="connect">
        <input v-model="ip" type="text" placeholder="IP" />
        <input v-model="password" type="password" placeholder="Password" />
        <input type="submit" class="button" />
    </form>
</template>

<style>
@import "@/../node_modules/@xterm/xterm/css/xterm.css";
</style>
