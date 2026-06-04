import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import ToastService from "primevue/toastservice";

const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: ".dark"
        }
    }
});
app.use(ToastService);

app.mount('#app');