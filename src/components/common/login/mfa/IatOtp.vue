<template>
    <div :id="docName">
        <div class="container p-0">
            <div class="card">
                <div class="p-0">
                    <form class="form-horizontal">
                        <div class="input-group">
                            <input
                                class="form-control"
                                :placeholder="t('voca.otp.input.default')"
                                v-model.trim.lazy="otp"
                                @keyup.enter="doOtpAuthRet"
                            />
                        </div>
                        <div
                            class="flex items-center mt-4 mb-0"
                            :class="popupFlag ? 'justify-content-end' : 'justify-content-between'"
                        >
                            <button
                                type="button"
                                class="btn btn-primary bxc bxc-save btn-min-w-100"
                                @click="doOtpAuthRet"
                            >
                                <a>{{ t('btn.login.default') }}</a>
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

const docName = 'Otp';
const popupFlag = ref(props.popupFlag);
const updateFlag = ref(false);
// const userInfo = ref(props.userInfo !== undefined ? props.userInfo : ({} as any));
const requestId = ref('');
const otp = ref('');
const failCnt = ref(0);

function closeModal() {
    updateFlag.value = false;
    failCnt.value = 0;
    commonts.hideModal();
    if (props.popupCloseFunc !== undefined) {
        props.popupCloseFunc(1);
    }
}
function doOtpAuth() {
    if (updateFlag.value === false) {
        let url = commonts.getUrl(gProp, '/api/webui/mfa/otp/auth');

        gProp?.axios
            .post(url, props.userInfo?.userId, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                requestId.value = response.data.requestId;
                updateFlag.value = true;
            })
            .catch((error: any) => {
                commonts.notificationShow(gProp, 'error', t('msg.isign.fail_otp_req'));
                commonts.debugLog(gProp, error.response);
            })
            .finally(getFinallyFunc);
    }
}

function doOtpAuthRet() {
    let url = commonts.getUrl(gProp, '/api/webui/mfa/otp/authret');
    let body = {
        requestId: requestId.value,
        otpNumber: otp.value
    };

    gProp?.axios
        .post(url, body, getAxiosOptions('DATA', {}))
        .then(function () {
            commonts.notificationShow(gProp, 'success', t('msg.isign.success_otp'));
            closeModal();
        })
        .catch((error: any) => {
            commonts.notificationShow(gProp, 'error', t('msg.isign.fail_otp'));
            commonts.debugLog(gProp, error.response);
            failCnt.value++;
            if (failCnt.value >= 5) {
                failCnt.value = 0;
                updateFlag.value = false;
                doOtpAuth();
            }
            commonts.debugLog(gProp, failCnt.value);
        })
        .finally(getFinallyFunc);
}

onMounted(() => {
    commonts.initPage({ docNameId: docName });
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    // updateFlag = props.userInfo?.flag;
    if (props.userInfo?.otpFlag === true) {
        // props.userInfo?.flag = false;
        doOtpAuth();
    }

    commonts.initPage({ docNameId: docName });
});
</script>
