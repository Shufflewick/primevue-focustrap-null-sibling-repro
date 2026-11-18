import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import FocusTrap from 'primevue/focustrap';
import App from './App.vue';

const app = createApp(App);
app.use(PrimeVue);
app.directive('focustrap', FocusTrap);
app.mount('#app');
