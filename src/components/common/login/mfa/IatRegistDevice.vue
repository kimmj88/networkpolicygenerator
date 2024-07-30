<template>
    <div :id="docName">
        <div class="container p-0">
            <div class="card">
                <div class="p-0">
                    <form class="form-horizontal">
                        <div class="container-fluid">
                            <!-- <div class="te">Device QR cod scan</div> -->
                            <img v-bind:src="'data:image/jpg;base64,' + qrCode" alt="qrCode" />
                        </div>
                        <div
                            class="flex items-center mt-4 mb-0"
                            :class="popupFlag ? 'justify-content-end' : 'justify-content-between'"
                        >
                            <button type="button" class="btn btn-primary bxc bxc-save btn-min-w-100" @click="doCheckQr">
                                <a>{{ t('btn.registration.default') }}</a>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { onMounted, onUpdated, ref } from 'vue';

const props = defineProps({
    userInfo: Object,
    popupFlag: {
        type: Boolean,
        default: true
    },
    popupCloseFunc: Function
});

const { gProp, commonts, t } = base();
const { getAxiosOptions, getFinallyFunc } = axios();

const docName = 'RegistDevice';
const popupFlag = ref(props.popupFlag);
const updateFlag = ref(false);

const requestId = ref('');
const qrCode = ref('');
const failCnt = ref(0);

function closeModal() {
    updateFlag.value = false;
    failCnt.value = 0;
    commonts.hideModal();
    if (props.popupCloseFunc !== undefined) {
        props.popupCloseFunc(1);
    }
}
function makeQr() {
    if (updateFlag.value === false) {
        let url = commonts.getUrl(gProp, '/api/webui/mfa/device/registration');

        gProp?.axios
            .post(url, props.userInfo?.userId, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                requestId.value = response.data.requestId;
                qrCode.value = response.data.registerQr;
                updateFlag.value = true;
            })
            .catch((error: any) => {
                commonts.notificationShow(gProp, 'error', t('msg.isign.fail_qr_code'));
                commonts.debugLog(gProp, error.response);
            })
            .finally(getFinallyFunc);
    }
}

function doCheckQr() {
    let body = {
        userId: props.userInfo?.userId,
        requestId: requestId.value
    };

    let url = commonts.getUrl(gProp, '/api/webui/mfa/device/registrationret');

    gProp?.axios
        .post(url, body, getAxiosOptions('DATA', {}))
        .then(() => {
            commonts.notificationShow(gProp, 'success', t('msg.isign.success_regist_dev'));
            closeModal();
        })
        .catch((error: any) => {
            commonts.notificationShow(gProp, 'error', t('msg.isign.fail_regist_dev'));
            commonts.debugLog(gProp, error.response);
            failCnt.value++;
            if (failCnt.value >= 5) {
                failCnt.value = 0;
                updateFlag.value = false;
                makeQr();
            }
        })
        .finally(getFinallyFunc);
}

onMounted(() => {
    commonts.initPage({ docNameId: docName });
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    if (props.userInfo?.regDeviceflag === true) {
        makeQr();
    }
    commonts.initPage({ docNameId: docName });
});
</script>
