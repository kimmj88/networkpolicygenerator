import { base } from '@/plugins/ts/base';
import { ref } from 'vue';

export function axios() {
    const { gProp, commonts, emitter, t } = base();

    const isAxiosFlag = ref(false);
    const processFlag = ref(false);

    const getAxiosOptions = (type: string, target?: { [x: string]: any }) => {
        commonts.showLoading();
        if (target === undefined) {
            target = {};
        }
        if (type.toUpperCase() === 'FILE') {
            target['responseType'] = 'blob';
            const headers: { [x: string]: any } = {};
            headers['X-XSRF-TOKEN'] = commonts.getXsrfToken(gProp);
            headers['Accept'] = 'multipart/form-data';

            target['headers'] = { ...headers };
        } else if (type.toUpperCase() === 'DATA') {
            const headers: { [x: string]: any } = {};
            headers['X-XSRF-TOKEN'] = commonts.getXsrfToken(gProp);
            headers['Content-Type'] = 'application/json; charset=UTF-8';
            headers['Cache-Control'] = 'no-cache';

            target['withCredentials'] = true;
            target['headers'] = { ...headers };
        }
        return target;
    };

    const getErrorFunc = (error: any) => {
        commonts.debugLog(gProp, error);

        // unautorith
        if (error?.response?.status === 401) {
            commonts.notificationShow(gProp, 'error', t('msg.error.info.unauthorized.default'));
            emitter.emit('logout');
        } else {
            commonts.notificationShow(gProp, 'error', t('msg.error.info.request.default'));
        }

        return false;
    };

    const getFinallyFunc = () => {
        if (isAxiosFlag.value) {
            isAxiosFlag.value = false;
        }
        commonts.hideLoading();
        commonts.initPage();
    };

    const pagingFillData = (paging: string, target: Array<{ [x: string]: any }>, searchData: { [x: string]: any }) => {
        if (paging === 'page' && searchData.page > 1 && target.length < searchData.page_per_data) {
            Array.from({ length: searchData.page_per_data - target.length }, (_v, i) => i).forEach(() => {
                target.push({ emptyData: '' });
            });
        }
    };

    return {
        isAxiosFlag,
        processFlag,
        getAxiosOptions,
        getErrorFunc,
        getFinallyFunc,
        pagingFillData
    };
}
