import enUS from '@/plugins/i18n/locale/enUS';
import koKR from '@/plugins/i18n/locale/koKR';
import zhCN from '@/plugins/i18n/locale/zhCN';
import { createI18n } from 'vue-i18n';

const messages = {
    ko: koKR,
    en: enUS,
    cn: zhCN
};

const i18n = createI18n({
    // something vue-i18n options here ...
    legacy: false, // you must set `false`, to use Composition API
    locale: 'en', // set locale
    fallbackLocale: 'en', // set fallback locale
    globalInjection: true,
    allowComposition: true,
    messages // set locale messages
});

export default i18n;
