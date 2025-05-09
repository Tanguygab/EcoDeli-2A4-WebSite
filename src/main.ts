import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
  
import App from './App.vue'
import router from './router'

const app = createApp(App)

import i18next from 'i18next'
import I18NextVue from "i18next-vue";
import enJson from "@/assets/i18n/en.json"
import frJson from "@/assets/i18n/fr.json"

i18next.init({
    lng: "en",
    debug: true,
    resources: {
        "en":  {"translation": enJson},
        "fr":  {"translation": frJson}
    }
})
app.use(I18NextVue, {i18next})

app.use(createPinia())
app.use(router)



app.mount('#app')
