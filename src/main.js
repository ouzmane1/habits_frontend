import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFlag, faShieldAlt, faFire, faCalendar, faStar, faTrophy, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

library.add(faFlag, faShieldAlt, faFire, faCalendar, faStar, faTrophy, faBullseye);

createApp(App).use(router).use(ElementPlus).component("font-awesome-icon", FontAwesomeIcon).mount('#app')