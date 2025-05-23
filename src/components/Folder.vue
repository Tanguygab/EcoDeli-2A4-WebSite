<script setup lang="ts">
import File from '@/components/File.vue'
import { ref } from 'vue'
import Icon from '@/components/Icon.vue'

const props = defineProps<{ name: string, files: string[] }>()
defineEmits(["open"])
const opened = ref<boolean>(false)

const folders: { [key: string]: string[] | string } = {}
for (const file of props.files) {
    if (file.includes("/")) {
        const arr = file.split('/');
        const folder = arr[0]
        arr.splice(0, 1)
        const subFile = arr.join("/")

        if (folders[folder]) (folders[folder] as string[]).push(subFile)
        else folders[folder] = [subFile]
    } else folders[file] = file
}

for (const folder in folders) {
    if (folders[folder] instanceof Array)
        (folders[folder] as string[]).sort((a, b) => b.includes("/") && !a.includes("/") ? 1 : a.includes("/") ? -1 : a.localeCompare(b))
}
</script>

<template>
    <div>
        <button class="button is-fullwidth" @click="opened = !opened">
            <span>{{ name }}</span>
            <Icon icon="fa-angle-down"/>
        </button>
        <div :class="'ml-3 is-flex-direction-column ' + (opened ? 'is-flex' : 'is-hidden')">
            <template v-for="(files, folder) of folders">
                <Folder v-if="files instanceof Array" :name="folder as string"
                        @open="file => $emit('open',`${folder}/${file}`)"
                        :files="files"
                />
                <File v-else :file="folder as string" @click="$emit('open', folder)"/>
            </template>
        </div>
    </div>
</template>

<style>
.is-fullwidth {
    justify-content: space-between;
    width: 100%;
}
</style>
