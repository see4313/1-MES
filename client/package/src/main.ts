import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import Aura from '@primeuix/themes/aura';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import PerfectScrollbar from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import PrimeVue from 'primevue/config';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(router);
app.use(PerfectScrollbar);
app.use(VueTablerIcons);
app.use(vuetify).mount('#app');
