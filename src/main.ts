// common.css
import '@/assets/css/common.css';
// tailwind CSS Init
import '@/assets/css/init_tailwind.css';
// vue3 datepicker
import '@vuepic/vue-datepicker/dist/main.css';
// boxicons
import 'boxicons/css/boxicons.min.css';
// vue-select@beta
import 'vue-select/dist/vue-select.css';

// frontend config
import ConfigTS from '@/config';
// common typescript
import CommonTS from '@/plugins/common';
import i18n from '@/plugins/i18n';

// A headless Vue 3 notification library to use with Tailwind CSS
import Notifications from 'notiwind';

// VueCookies
import VueCookies from 'vue3-cookies';
// vue3 datepicker
import Datepicker from '@vuepic/vue-datepicker';
// vue-select@beta
import vSelect from 'vue-select';
// Country Flag
import CountryFlag from 'vue-country-flag-next';

// axios
import axios from 'axios';

// dayjs
import dayjs from '@cm/utils/time/dayjs';
/**
// import dayjs from "dayjs";
// import dayjs_isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// import dayjs_isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// import dayjs_utc from "dayjs/plugin/utc";
// import dayjs_weekOfYear from "dayjs/plugin/weekOfYear";
 */

import 'flowbite';

import { useCommonStore } from '@/stores';
import { useMenuStore } from '@/stores/modules/Menu';
import { useNetworkStore } from '@/stores/modules/Network';
import { useUserStore } from '@/stores/modules/User';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(ConfigTS);
app.use(CommonTS);
app.use(i18n);
app.use(Notifications);
app.use(VueCookies, {
    expireTimes: '7d',
    path: '/',
    domain: '',
    secure: true,
    sameSite: 'None'
});

// eslint-disable-next-line vue/multi-word-component-names
app.component('datepicker', Datepicker);
app.component('v-select', vSelect);
app.component('country-flag', CountryFlag);

// store
const stores = {
    common: useCommonStore(),
    menu: useMenuStore(),
    user: useUserStore(),
    network: useNetworkStore()
};
app.config.globalProperties.stores = stores;

// ajax cookie 사용
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'XSRF-TOKEN-';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
app.config.globalProperties.axios = axios;

const configts = app.config.globalProperties.$configts;
app.config.globalProperties.$mode = configts.getMode();
app.config.globalProperties.$devMode = configts.getMode().toUpperCase() === 'DEV';
app.config.globalProperties.$uiVersion = configts.getUIVersion();
app.config.globalProperties.$gwprotocol = configts.getProtocol();
app.config.globalProperties.$gwip = configts.getGatewayIp();
app.config.globalProperties.$gwport = configts.getGatewayPort();
app.config.globalProperties.$component_type = configts.getComponentName();
app.config.globalProperties.$paging = configts.getPaging();
app.config.globalProperties.$multilanguage = configts.getMultiLanguage();
app.config.globalProperties.$ci_info = configts.getCIInfo();
app.config.globalProperties.$gnbPosition = configts.getGNBPosition();
app.config.globalProperties.$kmsflag = configts.getKMSFlag();
app.config.globalProperties.$mfaflag = configts.getMfaFlag();
app.config.globalProperties.$electronflag = configts.getElectronFlag();

/**
// // ajax cookie 사용
// axios.defaults.withCredentials = true;
// axios.defaults.xsrfCookieName = "XSRF-TOKEN-";
// axios.defaults.xsrfHeaderName = "X-XSRF-TOKEN";
// axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
// // axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
// // axios.defaults.baseURL = "https://keylink.autocrypt.io";
// axios.defaults.proxy = {
//     protocol: app.config.globalProperties.$gwprotocol,
//     host: app.config.globalProperties.$gwip,
//     port: app.config.globalProperties.$gwport,
// }
// console.log(axios.defaults);
// const instance = axios.create(axios.defaults);
// app.config.globalProperties.axios = instance;

// dayjs
// dayjs.extend(dayjs_utc);
// dayjs.extend(dayjs_weekOfYear);
// dayjs.extend(dayjs_isSameOrBefore);
// dayjs.extend(dayjs_isSameOrAfter);
 */
app.config.globalProperties.dayjs = dayjs;

app.config.globalProperties.$menuInfo = {
    menuId: '',
    menuNm: '',
    menuTypeFlag: false,
    menuType: '',
    menuUrl: '',
    menuAuth: {},
    menuList: []
};

app.config.globalProperties.$pageInfo = {
    page_per_data: 30, // scroll 사용시 6개보다 작게 세팅하지 말것
    qbar_view_cnt: 5,
    qbar_view_curr_idx: 1,
    page: 1
};

app.config.globalProperties.$msgQueue = [];

// Check local storage to handle refreshes
if (window.localStorage) {
    let currLang = app.config.globalProperties.$cookies.get('current_language');
    if (currLang === undefined || currLang === null) {
        currLang = window.localStorage.getItem('currentLang');
    }
    if (currLang === undefined || currLang === null) {
        currLang = configts.getDefaultLanguage();
    }
    app.config.globalProperties.$i18n.locale = currLang;
    stores.common.setCurrentLang(currLang);

    let currRegion = app.config.globalProperties.$cookies.get('current_region');
    if (currRegion === undefined || currRegion === null) {
        currRegion = window.localStorage.getItem('currentRegion');
    }
    if (currRegion === undefined || currRegion === null) {
        currRegion = stores.common.regions[0].id;
    }
    stores.common.setCurrentRegion(currRegion);
}

router?.isReady().then(() => {
    app.mount('#app').$nextTick(() => {
        // Use contextBridge
        window.ipcRenderer.send('ping');
        window.ipcRenderer.on('main-process-message', (_event, message) => {
            console.log('main-process-message', message);
        });

        window.ipcRenderer.on('quit-remove-data', (_event, message) => {
            console.log('\n\n\n\nquit-remove-data\n\n\n\n', message);
            // 종료시 초기화 필요 정보 삭제
            stores.menu.clearMenuInfo();
            stores.user.clearUser();
            window.localStorage.removeItem('prevUrl');
        });
    });
});
