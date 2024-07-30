import i18n from '@/plugins/i18n';
import { getCurrentInstance } from 'vue';

export const base = () => {
    const gProp = getCurrentInstance()?.appContext.config.globalProperties;
    const stores = gProp?.stores;
    const route = gProp?.$route;
    const router = gProp?.$router;
    const commonts = gProp?.$commonts;
    const configts = gProp?.$configts;
    const emitter = stores?.common.emitter;
    const { t, locale } = i18n.global;

    return { stores, route, router, gProp, commonts, configts, emitter, t, locale };
};
