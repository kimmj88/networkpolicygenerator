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
                                @keyup.enter="doOtpVerify"
                            />
                        </div>
                        <div
                            class="flex items-center mt-4 mb-0"
                            :class="popupFlag ? 'justify-content-end' : 'justify-content-between'"
                        >
                            <button
                                type="button"
                                class="btn btn-primary bxc bxc-save btn-min-w-100"
                                @click="doOtpVerify"
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
const otp = ref('');
const failCnt = ref(0);

function closeModal() {
    failCnt.value = 0;
    commonts.hideModal();
    if (props.popupCloseFunc !== undefined) {
        props.popupCloseFunc(1);
    }
}

function doOtpVerify() {
    commonts.debugLog(gProp, [props.userInfo?.userId, otp.value]);
    let body = {
        user_id: props.userInfo?.userId,
        otp_number: otp.value
    };
    commonts.debugLog(gProp, body);

    let url = commonts.getUrl(gProp, '/api/webui/mfa/ath/otp/verify');

    gProp?.axios
        .post(url, body, getAxiosOptions('DATA', {}))
        .then(function () {
            closeModal();
        })
        .catch((error: any) => {
            commonts.notificationShow(gProp, 'error', t('msg.isign.fail_otp_req'));
            commonts.debugLog(gProp, error.response);
        })
        .finally(getFinallyFunc);
}

onMounted(() => {
    commonts.initPage({ docNameId: docName });
});

onUpdated(() => {
    commonts.initPage({ docNameId: docName });
});
</script>
