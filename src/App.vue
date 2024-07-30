<template>
    <div class="body" :class="headerPosition ? 'gnb-left' : 'gnb-top'">
        <div class="body-contents content-bg" :style="containerHeight">
            <div class="gnb content-bg" :class="headerPosition ? 'left' : 'top'" v-if="headerFlag">
                <GNB v-if="headerPosition === true" />
                <Header v-if="headerPosition === false" />
            </div>
            <div class="content">
                <router-view :style="bodyHeight" />
            </div>
        </div>
        <!-- 로딩 -->
        <div id="popupBg" class="popupBg" />
        <div id="loadingBg" class="loadingBg">
            <div id="loading"></div>
            <div id="loading_text"></div>
        </div>
        <Notification />
        <ConfirmPopup class="popup z-[10000]" :id="'refConfirmPopup'" :title="confirmTitle" :msg="confirmMsg"
            :type="confirmType" :cb-func="confirmCbFunc" :able-text="confirmAbleText" :disable-text="confirmDisableText"
            @close="commonts.hideModal(confirmModal)"></ConfirmPopup>
    </div>
</template>

<script setup lang="ts">
import GNB from '@/components/common/layout/GNB.vue';
import Header from '@/components/common/layout/Header.vue';
import Upload from '@/components/common/util/file/Upload.vue';
import BasePopup from '@/components/common/util/popup/BaseCommon.vue';
import ConfirmPopup from '@/components/common/util/popup/Confirm.vue';
import Notification from '@/components/common/util/popup/Notification.vue';
import { base } from '@/plugins/ts/base';
import { axiosIntercept } from '@cm/types/domain/apis/common';
import { useTitle } from '@vueuse/core';
import { initFlowbite } from 'flowbite';
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue';

const { stores, route, router, gProp, emitter, commonts, t } = base();

axiosIntercept();

const uploadRef = ref(null as any);

const headerFlag = ref(true);
const footerFlag = ref(true);
const headerPosition = gProp?.$gnbPosition; // true: left, false: top
const component_name = commonts.getCompName(gProp) ?? 'NetworkPolicyGenerator';

let url = '';
let body = {};
let options = {};

const confirmTitle = ref('');
const confirmMsg = ref('');
const confirmType = ref('');
const confirmCbFunc = ref(null as any);
const confirmAbleText = ref(undefined as any);
const confirmDisableText = ref(undefined as any);

const fileUploadTitle = ref('');
const fileUploadHeaderShow = ref(false);
const fileUploadNoticeFlag = ref(false);
const fileUploadUploadType = ref('');
const fileUploadFileSize = ref(0);
const fileUploadId: { [x: string]: any } = ref({
    parentId: '',
    childId: ''
});
const fileUploadDataInfo = computed(() => {
    return JSON.stringify(fileUploadId.value);
});

const containerHeight = computed(() => {
    let calcStr = '100vh';

    return 'height: calc(' + calcStr + ') !important;';
});

const bodyHeight = computed(() => {
    return '';
});

function logout() {
    url = commonts.getUrl(gProp, '/authorize/logout');

    body = {};
    options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json; charset=UTF-8',
            'X-XSRF-TOKEN': gProp?.$commonts.getXsrfToken(gProp)
        }
    };

    commonts.debugLog(gProp, ['logout -> ' + url]);
    stores.common
        .logout({
            url: url,
            body: body,
            options: options,
            gProp: gProp,
            signInError: {}
        })
        .then(() => {
            router?.replace('/');
        });
}

function getUserInfo() {
    // ["/login"].forEach((target: string) => {
    // 	if (target !== router?.currentRoute.value.path) {
    // 		url = commonts.getUrl(gProp, "/authorize/info");

    // 		body = {
    // 			language_code: stores.common.currentLang,
    // 		};
    // 		options = {
    // 			headers: {
    // 				"Cache-Control": "no-cache",
    // 				"Content-Type": "application/json; charset=UTF-8",
    // 				"X-XSRF-TOKEN": gProp?.$commonts.getXsrfToken(gProp),
    // 			},
    // 		};

    // 		stores.user
    // 			.userInfo({
    // 				url: url,
    // 				body: body,
    // 				options: options,
    // 				gProp: gProp,
    // 				signInError: {},
    // 			})
    // 			.then(() => {
    // 				// 메뉴 정보가 없는 경우 url을 통해 메뉴 정보 세팅
    // 				if (stores.menu.menuInfo.menuUrl === "") {
    // 					commonts.debugLog(gProp, route);
    // 					commonts.debugLog(gProp, route?.path);
    // 					commonts.debugLog(gProp, router?.currentRoute);
    // 					stores.menu.menuList.some((menu: { [x: string]: any }) => {
    // 						if (route?.path === "/") {
    // 							return true;
    // 						} else if (menu.menu_url === route?.path) {
    // 							commonts.debugLog(gProp, menu);
    // 							commonts.setMenuInfo(
    // 								gProp,
    // 								menu.menu_id,
    // 								menu.menu_type_flag,
    // 								menu.menu_type,
    // 								menu.menu_url,
    // 								stores.menu.menuList
    // 							);
    // 							return true;
    // 						}
    // 					});
    // 				}
    // 			});
    // 	}
    // });
    stores.user.userInfo({}).then(() => {
        // 메뉴 정보가 없는 경우 url을 통해 메뉴 정보 세팅
        if (stores.menu.menuInfo.menuUrl === '') {
            stores.menu.menuList.some((menu: { [x: string]: any }) => {
                if (route?.path === '/') {
                    return true;
                } else if (menu.menu_url === route?.path) {
                    commonts.setMenuInfo(
                        gProp,
                        menu.menu_id,
                        menu.menu_type_flag,
                        menu.menu_type,
                        menu.menu_url,
                        stores.menu.menuList
                    );
                    return true;
                }
            });
        }
    });
}
const confirmModal = ref(null as any);
function openConfirmPopup(
    title: string,
    msg: string,
    method: string,
    cbFunc?: Function,
    ableText?: string,
    disableText?: string
) {
    commonts.debugLog(gProp, 'function openConfirm');
    confirmTitle.value = title;
    confirmMsg.value = msg;
    confirmType.value = method;
    if (cbFunc !== undefined) confirmCbFunc.value = cbFunc;
    if (ableText !== undefined) confirmAbleText.value = ableText;
    if (disableText !== undefined) confirmDisableText.value = disableText;

    commonts.debugLog(gProp, [ableText, disableText, confirmAbleText.value, confirmDisableText.value]);

    commonts.showModal(confirmModal.value);
}

const fileUploadModal = ref(null as any);
function uploadFileModal(
    uploadType: string,
    noticeFlag: boolean,
    fileSize?: number,
    title?: string,
    dataInfo?: { [x: string]: any }
) {
    commonts.debugLog(gProp, ['function uploadFileModal', 'title -> ' + title]);
    fileUploadTitle.value = title === undefined || commonts.isEmpty(title) ? t('voca.file.upload.default') : title;
    fileUploadNoticeFlag.value = noticeFlag;
    fileUploadUploadType.value = uploadType;
    fileUploadFileSize.value = fileSize ?? 10;
    if (dataInfo !== undefined) fileUploadId.value = dataInfo;

    commonts.debugLog(gProp, [fileUploadFileSize.value]);
    commonts.showModal(fileUploadModal.value);
}

function pageInit() {
    useTitle(t('voca.name.system.' + component_name?.toLowerCase() + '.default'));
    getUserInfo();
    commonts.hideLoading();
}

emitter.on(
    'openConfirm',
    (data: {
        title: string;
        msg: string;
        method: string;
        cbFunc?: Function;
        ableText?: string;
        disableText?: string;
    }) => {
        commonts.debugLog(gProp, 'emitter openConfirm');
        commonts.debugLog(gProp, [data.title, data.msg, data.method]);
        openConfirmPopup(data.title, data.msg, data.method, data?.cbFunc, data?.ableText, data?.disableText);
    }
);

emitter.on('closeConfirm', () => {
    commonts.debugLog(gProp, 'emitter closeConfirm');
    commonts.hideModal(confirmModal.value);
});

emitter.on(
    'uploadFileModal',
    (data: {
        uploadType: string;
        noticeFlag: boolean;
        fileSize?: number;
        title?: string;
        dataInfo?: { [x: string]: any };
    }) => {
        commonts.debugLog(gProp, 'uploadFileModal');
        uploadFileModal(data.uploadType, data.noticeFlag, data.fileSize, data.title, data.dataInfo);
    }
);

emitter.on('logout', () => {
    commonts.debugLog(gProp, 'emitter logout');
    logout();
});

emitter.on('getUserInfo', () => {
    getUserInfo();
});

emitter.on('view-flag', (data: { [x: string]: boolean }) => {
    commonts.debugLog(gProp, ['view-flag emitter ', data, stores.common.isAuthenticated]);
    headerFlag.value = data['header'];
    footerFlag.value = data['footer'];
});

onBeforeMount(() => {
    commonts.showLoading();
    // system rootMenuId 조회
    commonts.getRootMenuId(gProp);
});
onMounted(() => {
    pageInit();
    initFlowbite();

    confirmModal.value = commonts.makeModal('refConfirmPopup');
});
onUnmounted(() => {
    emitter.off('openConfirm');
    emitter.off('closeConfirm');
    emitter.off('uploadFileModal');
    emitter.off('logout');
    emitter.off('getUserInfo');
    emitter.off('view-flag');
});
</script>
