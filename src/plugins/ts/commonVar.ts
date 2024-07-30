import { base } from '@/plugins/ts/base';
import { computed, reactive, ref, watch } from 'vue';

export interface CommonVarArgs {
    props?: { [x: string]: any };
    searchFunc?: Function;
}

export function commonVar(data?: CommonVarArgs) {
    // nosonar
    const currScrollTop = ref(data?.props?.currScrollTop);

    const { gProp, stores, commonts, locale, t } = base();

    const uiVersion = ref(gProp?.$uiVersion);
    const gnbPosition = ref(gProp?.$gnbPosition);
    const devMode = gProp?.$devMode;
    const paging = ref(gProp?.$paging);
    const svcType = computed(() => {
        let svcType = stores?.user?.user?.svcType;
        if (svcType == null || svcType == undefined || svcType === '') {
            const userInfo = localStorage?.getItem('user');
            if (userInfo != null) {
                svcType = JSON.parse(userInfo).svcType;
            }
        }
        return svcType;
    });
    const standard = computed(() => gProp?.$standard);
    const commonCode = reactive({} as any);

    const languages = ref(stores?.common?.languages);
    const regions = ref(stores?.common?.regions);

    const ci = gProp?.$ci_info; // UI 사용된 CI
    const multi_language = gProp?.$multilanguage; // 다국어 처리여부

    const currentLang = computed(() => {
        let langTx = { flag: '', language: '', datepicker_language: '', title: '', index: -1 };
        const languageList = stores?.common?.languages;
        for (const langIdx in languageList) {
            if (languageList[langIdx].language === locale.value) {
                langTx = languageList[langIdx];
            }
        }

        if (langTx?.index < 0) {
            langTx = languageList[1];
        }
        return langTx;
    });

    const currentRegion = computed(() => {
        let regionTx = { id: '', name: '', add_class: '', path: [], index: -1 };
        const regionList = stores?.common?.regions;
        for (const regionIdx in regionList) {
            if (regionList[regionIdx].id === stores.common.currentRegion) {
                commonts.debugLog(gProp, ['currentRegion', regionList[regionIdx].id, stores.common.currentRegion]);
                regionTx = regionList[regionIdx];
            }
        }

        if (regionTx?.index < 0) {
            regionTx = regionList[0];
        }
        return regionTx;
    });

    const tabIdx = reactive({
        popIn: commonts?.getInitTabIdx('POP_IN'),
        popBtn: commonts?.getInitTabIdx('POP_BTN'),
        detIn: commonts?.getInitTabIdx('DET_IN'),
        detBtn: commonts?.getInitTabIdx('DET_BTN'),
        lstIn: commonts?.getInitTabIdx('LST_IN'),
        lstBtn: commonts?.getInitTabIdx('LST_BTN'),
        paging: commonts?.getInitTabIdx('PAGING'),
        header: commonts?.getInitTabIdx('HEADER'),
        footer: commonts?.getInitTabIdx('FOOTER')
    });

    const contentHeaderHeight = 70;

    const watchBottomFlag = ref(true);
    const content = ref(document?.querySelector('.content-wrapper'));
    const targetSize = ref(window.innerHeight);
    const contentSize = ref(content.value !== null ? content.value.scrollHeight : window.innerHeight);

    const compPagePerData = computed(() => {
        const tableRowHeight = 48;
        let retVal = Number(gProp?.$pageInfo.page_per_data);
        if (gProp?.$paging === 'scroll') {
            // data 공간 크기
            const searchCard: HTMLElement | null = document?.querySelector('.search-card');
            const dataHeight =
                window.innerHeight - (searchCard !== null ? searchCard.offsetHeight : contentHeaderHeight * 2);
            retVal = Math.floor(dataHeight / tableRowHeight) + 1;
        }
        return retVal;
    });

    function getDateFormat(val: string, pattern?: string) {
        return val !== undefined ? commonts.convertDate(gProp, val, pattern ?? '', 'utc') : '';
    }

    function setEmptyMsg(target: string | { [x: string]: any }, baseMsg: string, emptyMsg?: string) {
        // console.log("setEmptyMsg --->", target)
        let retMsg = t('msg.info.select.default');
        if (commonts.isEmpty(target)) {
            if (emptyMsg !== undefined) {
                retMsg = emptyMsg;
            }
        } else {
            retMsg = baseMsg;
        }
        return retMsg;
    }

    function setCodeMsg(target: { [x: string]: any }) {
        // console.log("setCodeMsg --->", target)
        let retMsg = target?.cd_nm;
        if (!commonts.isEmpty(target) && typeof target !== 'string') {
            target?.ml_info?.forEach((ml: any) => {
                if (ml.lang_cd === currentLang.value.language.toUpperCase()) {
                    retMsg = ml.name;
                }
            });
        }
        return retMsg;
    }

    watch(
        () => data?.props?.currScrollTop,
        (curr: any) => {
            if (gProp?.$paging === 'scroll') {
                currScrollTop.value = curr;
                content.value = document?.querySelector('.content-wrapper');
                targetSize.value = curr + window.innerHeight;
                contentSize.value = content.value !== null ? content.value.scrollHeight : window.innerHeight;
                const c = 5; // 보정값

                const bottomOfWindow = targetSize.value + c >= contentSize.value;
                if (bottomOfWindow && watchBottomFlag.value) {
                    watchBottomFlag.value = false;
                    setTimeout(() => {
                        watchBottomFlag.value = true;
                    }, 1000);
                    if (data?.searchFunc !== undefined) data?.searchFunc({ bottomFlag: true });
                }
            }
        }
    );

    return {
        // variable
        uiVersion,
        gnbPosition,
        devMode,
        standard,
        svcType,
        tabIdx,
        commonCode,
        languages,
        currentLang,
        regions,
        currentRegion,
        ci,
        multi_language,
        paging,
        currScrollTop,
        compPagePerData,
        contentSize,
        // function
        getDateFormat,
        setEmptyMsg,
        setCodeMsg
    };
}
