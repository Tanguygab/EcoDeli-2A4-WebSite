<script setup lang="ts">
import L, { type LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { onMounted } from 'vue'
import { t } from 'i18next'

const props = defineProps<{lat: number, lon: number}>();
const pos: LatLngExpression = [props.lat, props.lon]

onMounted(async () => {
    const map = L.map('map').setView(pos, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const marker = L.marker(pos).addTo(map);
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${props.lat}&lon=${props.lon}&format=json`)
    const json = await res.json()
    console.log(json)
    marker.bindPopup(`<b>${t("delivery.name")}</b><br>${json.display_name}`).openPopup();
})
</script>

<template>
    <div id="map"></div>
</template>

<style scoped>
#map {
    width: 100vh;
    height: 75vh;
    border-radius: 20px;
}
</style>
