<template>
    <div :id="docName">
        <div class="container p-0">
            <div class="card" :class="popupFlag ? 'border-0' : ''">
                <div class="p-0">
                    <table class="table table-bordered">
                        <caption style="display: none"></caption>
                        <colgroup>
                            <col style="width: 30%" />
                            <col style="width: 70%" />
                        </colgroup>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <th scope="row" class="p-1">
                                    <div class="ellipsis">
                                        <span :title="t('msg.isign.pc_serial_number')">
                                            {{ t('msg.isign.pc_serial_number') }}
                                        </span>
                                    </div>
                                </th>
                                <td>
                                    <input
                                        id="server_key"
                                        type="text"
                                        class="form-control string required-none"
                                        disabled
                                        v-model.trim.lazy="serverKey"
                                        :tabindex="tabIdx.detIn"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="p-1">
                                    <div class="ellipsis">
                                        <span :title="t('msg.isign.otp_client_key')">
                                            {{ t('msg.isign.otp_client_key') }}
                                        </span>
                                    </div>
                                </th>
                                <td>
                                    <input
                                        id="client_key"
                                        type="text"
                                        class="form-control string required"
                                        v-model.trim.lazy="otpClientKey"
                                        :placeholder="t('msg.info.input.default')"
                                        :tabindex="tabIdx.detIn + 2"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="p-1">
                                    <div class="ellipsis">
                                        <span :title="t('msg.isign.otp')">
                                            {{ t('msg.isign.otp') }}
                                        </span>
                                    </div>
                                </th>
                                <td>
                                    <input
                                        id="tmp_otp"
                                        type="text"
                                        class="form-control string required"
                                        v-model.trim.lazy="tmpOtp"
                                        :placeholder="t('voca.otp.input.default')"
                                        :tabindex="tabIdx.detIn + 3"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center" colspan="2">
                                    <button
                                        class="btn btn-primary bxc bxc-save"
                                        @click="doRegistOtp"
                                        :tabindex="tabIdx.detBtn"
                                    >
                                        <a>{{ t('btn.registration.default') }}</a>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
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
const { tabIdx } = commonVar();

const docName = 'AthRegistOtp';
const popupFlag = ref(props.popupFlag);
const updateFlag = ref(false);
const serverKey = ref('0000');
const failCnt = ref(0);
const otpClientKey = ref('');
const tmpOtp = ref('');

function closeModal() {
    updateFlag.value = false;
    failCnt.value = 0;
    commonts.hideModal();
    if (props.popupCloseFunc !== undefined) {
        props.popupCloseFunc(1);
    }
}
function doGetServerKey() {
    if (updateFlag.value === false) {
        let url = commonts.getUrl(gProp, '/api/webui/mfa/ath/getServerKey');

        gProp?.axios
            .post(url, null, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                serverKey.value = response.data;
                commonts.debugLog(gProp, response.data);
                updateFlag.value = true;
            })
            .catch((error: any) => {
                commonts.notificationShow(gProp, 'error', t('msg.isign.fail_otp_req'));
                commonts.debugLog(gProp, error.response);
            })
            .finally(getFinallyFunc);
    }
}

function doRegistOtp() {
    if (otpClientKey.value === '' || tmpOtp.value === '') {
        commonts.notificationShow(gProp, 'error', t('msg.error.wrong_input.default'));
        return false;
    }
    let body = {
        user_id: props.userInfo?.userId,
        otp_server_key: serverKey.value,
        otp_client_key: otpClientKey.value,
        test_otp_number: tmpOtp.value
    };

    let url = commonts.getUrl(gProp, '/api/webui/mfa/ath/otp/registration');

    gProp?.axios
        .post(url, body, getAxiosOptions('DATA', {}))
        .then(function (response: any) {
            commonts.debugLog(gProp, response.data);
            updateFlag.value = true;
            closeModal();
        })
        .catch((error: any) => {
            commonts.notificationShow(gProp, 'error', t('msg.isign.fail_otp_req'));
            commonts.debugLog(gProp, error.response);
            tmpOtp.value = '';
        })
        .finally(getFinallyFunc);
}

onMounted(() => {
    commonts.initPage({ docNameId: docName });
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    // updateFlag = props.userInfo?.flag;
    if (props.userInfo?.athRegOtpFlag === true) {
        doGetServerKey();
    }

    commonts.initPage({ docNameId: docName });
});
</script>
