<template>
    <div :id="docName" class="login">
        <span class="title center">
            <img
                v-if="ci === 'kl'"
                src="@/assets/img/BI_AutoCryptKeyLink_white.png"
                :alt="t('voca.name.system.' + commonts.getCompName(gProp) + '.default')"
            />
            <span v-else>
                {{ t('voca.name.system.' + commonts.getCompName(gProp) + '.default') }}
            </span>
        </span>
        <div :id="docName" class="input-form">
            <div class="body">
                <form>
                    <AtomInput
                        v-model="user_id"
                        class="text-white h-12"
                        :id="'inputEmail'"
                        :placeholder="t('voca.id.default')"
                        :tabindex="1"
                    />
                    <AtomInput
                        v-model="user_pw"
                        class="mt-3 text-white h-12"
                        :id="'inputPassword'"
                        :input-type="'password'"
                        :placeholder="t('voca.password.default')"
                        @keyup.enter="enterOnPassword"
                        :tabindex="2"
                    />
                </form>
                <div class="id-saver">
                    <AtomInput
                        v-model="login_init.save_flag"
                        :input-type="'checkbox'"
                        :label-text="t('voca.id.save.default')"
                    />
                </div>
                <div
                    class="alert mt-3 bg-white w-full p-2 rounded-md"
                    style="animation: unset"
                    v-if="signInError.flag === true"
                >
                    <strong>{{ t('msg.error.info.login.default') }}</strong
                    ><br />
                    <div v-if="signInError.lock_msg_key !== ''">
                        {{ t(signInError.lock_msg_key) }}
                    </div>
                    <div v-else>
                        <div v-if="signInError.lock_remind_cnt > 0">
                            {{ t('msg.error.info.login.account.argv.default', [signInError.lock_remind_cnt]) }}
                        </div>
                        <div v-else>
                            {{ t('msg.error.info.login.account.default') }}
                        </div>
                        <p v-if="signInError.limit_date_msg !== ''">
                            {{ signInError.limit_date_msg }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="tool">
                <AtomButton
                    :button-name="'btn.login.default'"
                    @click="doLogin"
                    :class-text="'absolute mt-3 bg-white w-full h-12 bxc bxc-login'"
                />
            </div>
            <div class="w-full flex justify-around align-center mt-[5rem]" v-if="false">
                <AtomButton
                    :button-name="'btn.user.registration.default'"
                    @click="register"
                    :class-text="btnClassText"
                />
                <AtomButton
                    :button-name="'btn.password.reset.default'"
                    @click="forgetPassword"
                    :class-text="btnClassText + ' bxc bxc-reset'"
                />
            </div>
            <!--
                예제 코드 Sample
                <button data-modal-target="register-modal" data-modal-toggle="register-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                    Toggle modal
                </button>
                <AtomInput v-model="user_pw" :input-type="'checkbox'" :label-text="'테스트'"></AtomInput>
                <AtomInput :name="'test'" :model-value="'test1'" :class-text="''" :input-type="'radio'" :label-text="'테스트1'"></AtomInput>
                <AtomInput :name="'test'" :model-value="'test2'" :input-type="'radio'" :label-text="'테스트2'"></AtomInput>
                <AtomButton :button-name="'검색'" :type="'search'" @click="clickbutton"/>
                <AtomButton :button-name="'목록'" :type="'list'" @click="clickbutton"/>
                <AtomButton :button-name="'생성'" :type="'create'" @click="clickbutton"/>
                <AtomInput v-model="user_id" :class-text="''" :placeholder="t('voca.id.default')"></AtomInput>
                <AtomInput v-model="user_pw" :input-type="'password'" :class-text="''" :placeholder="t('voca.password.default')"></AtomInput>
                <AtomLabel :class-text="'absolute text-white w-full h-12'" :label-text="'label test'"></AtomLabel>
                <MoleculeInput :label-text="t('voca.group.code.default')" class="mt-[80px]" v-model="user_pw"></MoleculeInput>
                <AtomButton :button-name="'실행'" :click-func="clickbutton"/>
                <AtomImage :source="'https://i.namu.wiki/i/J1X0hwoxxO9yH6TfzR2CWnjmBYMdBWNzbspnWhuL-ILFk_ijDMxMwMmgsl7ntTVWefyfNDIi-bPvAOQR8SNt-qX8g4lyYABmKz072tEh6DGcJc1JyHuu0WSkpXZxrMTw1MsFAbFp3-HdE_k3e2idIQ.webp'"></AtomImage>
                <AtomImage :source="'https://cdn.pixabay.com/photo/2023/09/17/16/02/crab-8258856_640.jpg'"></AtomImage>
                <AtomImage :source="'data:image/jpeg;base64,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'"></AtomImage>
                <Search></Search>
            -->
        </div>
        <div
            class="fixed bottom-0 left-0 z-[200] w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600"
        >
            <componentFooter />
        </div>
        <BasePopup class="z-[200]" :id="registerId" :add-body-class="'p-0'" @close="commonts.hideModal(registerModal)">
            <template v-slot:title>{{ t('voca.account.registration.default') }}</template>
            <template v-slot:msg>
                <Register :popup-flag="true" @close="commonts.hideModal(registerModal)" />
            </template>
        </BasePopup>
        <BasePopup
            class="z-[200]"
            :id="resetPasswordId"
            :add-body-class="'p-0'"
            @close="commonts.hideModal(resetPasswordModal)"
        >
            <template v-slot:title>{{ t('voca.password.reset.default') }}</template>
            <template v-slot:msg>
                <ForgotPassword :popup-flag="true" @close="commonts.hideModal(resetPasswordModal)" />
            </template>
        </BasePopup>
        <!--
            # Atomic 샘플코드
            <BasePopup
                class="z-[200]" ref="refIatOtp" :add-body-class="'p-0'">
                <template v-slot:title>{{ t("voca.otp.auth.default") }}</template>
                <template v-slot:msg>
                    <IatOtp :user-info="userInfo" :popup-flag="true" :popup-close-func="login" />
                </template>
            </BasePopup>
            <BasePopup
                class="z-[200]" ref="refIatDeviceRegister" :add-body-class="'p-0'">
                <template v-slot:title>{{ t("voca.account.registration.default_device") }}</template>
                <template v-slot:msg>
                    <IatRegistDevice :user-info="userInfo" :popup-flag="true" :popup-close-func="doIatRegistOtp" />
                </template>
            </BasePopup>
            <BasePopup
                class="z-[200]" ref="refIatOtpRegister" :add-body-class="'p-0'">
                <template v-slot:title>{{ t("voca.account.registration.default_otp") }}</template>
                <template v-slot:msg>
                    <IatRegistOtp :user-info="userInfo" :popup-flag="true" />
                </template>
            </BasePopup>
            <BasePopup
                class="z-[200]" ref="refAthOtpRegister" :add-body-class="'p-0'">
                <template v-slot:title>{{ t("voca.account.registration.default_otp_device") }}</template>
                <template v-slot:msg>
                    <AthRegistOtp :user-info="userInfo" :popup-flag="true" />
                </template>
            </BasePopup>
            <BasePopup
                class="z-[200]" ref="refAthOtp" :add-body-class="'p-0'">
                <template v-slot:title>{{ t("voca.otp.auth.default") }}</template>
                <template v-slot:msg>
                    <AthOtp :user-info="userInfo" :popup-flag="true" :popup-close-func="login" />
                </template>
            </BasePopup>
        -->
    </div>
</template>

<script setup lang="ts">
import componentFooter from '@/components/common/layout/Footer.vue';
import ForgotPassword from '@/components/common/user/ForgotPassword.vue';
import Register from '@/components/common/user/Register.vue';
import BasePopup from '@/components/common/util/popup/BaseCommon.vue';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { ipRegex } from '@/plugins/ts/regex';
import AtomButton from '@a/Button.vue';
import AtomInput from '@a/Input.vue';
import { computed, onMounted, onUnmounted, onUpdated, reactive, ref, toRefs } from 'vue';

const props = defineProps({
    toUrl: String,
    popupFlag: {
        type: Boolean,
        default: false
    }
});

const btnClassText =
    'w-full h-12 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75 min-w-[10rem] min-h-[2.5rem]';

const { stores, emitter, router, gProp, commonts, t } = base();
const { getAxiosOptions, getFinallyFunc } = axios();

const docName = 'login';

const { ci } = commonVar();

const registerId = 'registerModal';
const registerModal = ref(null as any);

const resetPasswordId = 'resetPasswordModal';
const resetPasswordModal = ref(null as any);

const { toUrl } = toRefs(props);
const popupFlag = ref(props.popupFlag);

const mfaFlag = ref(gProp?.$configts.getMfaFlag());

const user_id = ref('');
const user_pw = ref('');

const login_init = reactive({
    save_flag: false,
    id: ''
});

const signInError = reactive({
    flag: false,
    limit_date: '',
    limit_date_msg: computed(() => {
        let retVal = '';
        if (!commonts.isEmpty(signInError.limit_date)) {
            retVal = t('msg.error.info.login.limit.argv.default', [
                commonts.convertDate(gProp, signInError.limit_date, '')
            ]);
        }
        return retVal;
    }),
    lock_remind_cnt: 0,
    lock_msg_key: ''
});

const userInfo = ref({});
const refAthOtpRegister = ref(null as any);
const refAthOtp = ref(null as any);
/*
OTP 사용시 추가되는 코드
const refIatOtp = ref(null as any);
const refIatDeviceRegister = ref(null as any);
const refIatOtpRegister = ref(null as any);
 */

const emit = defineEmits(['close']);

function doLogin() {
    if (mfaFlag.value === false) {
        login();
    } else {
        checkMfaTypeAndStatus();
    }
}

function login() {
    // data validation
    let targetDoc = document.querySelector('#' + docName);
    if (user_id.value === '') {
        commonts.notificationShow(gProp, 'error', t('msg.error.wrong_input.item.argv.default', [t('voca.id.default')]));
        (targetDoc?.querySelector('input.id') as HTMLInputElement).focus();
        return false;
    } else if (user_pw.value === '') {
        commonts.notificationShow(
            gProp,
            'error',
            t('msg.error.wrong_input.item.argv.default', [t('voca.password.default')])
        );
        (targetDoc?.querySelector('input.pw') as HTMLInputElement).focus();
        return false;
    }

    if (login_init.save_flag) {
        login_init.id = user_id.value;
        localStorage.setItem('login_init', JSON.stringify(login_init));
    }

    let url = commonts.getUrl(gProp, '/authorize/info/check');

    let body = {
        user_id: user_id.value,
        user_pw: user_pw.value
    };

    gProp?.axios
        .post(url, body, getAxiosOptions('DATA', {}))
        .then(function (response: any) {
            let loginIp = response.data;
            if (loginIp.trim() !== '' && loginIp.trim().length > 0 && loginIp.search(ipRegex) !== -1) {
                doDuplicateConfirm(loginIp);
            } else {
                loginProcess();
            }
        })
        .catch(() => {
            loginProcess();
        })
        .finally(getFinallyFunc);
}

function doDuplicateConfirm(loginIp: string) {
    emitter.emit('openConfirm', {
        title: t('voca.duplicate.login.confirm.default'),
        msg: t('msg.confirm.login.argv.duplicate.default', [loginIp]),
        method: 'YN',
        cbFunc: doDuplicateProcess
    });
}

function doDuplicateProcess(retVal: boolean) {
    if (retVal) {
        loginProcess();
    }
    return false;
}

function loginProcess() {
    console.log('loginProcess');
    let url = commonts.getUrl(gProp, '/authorize/login');

    let body = {
        user_id: user_id.value,
        user_pw: user_pw.value
    };
    let options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json; charset=UTF-8',
            'X-XSRF-TOKEN': gProp?.$commonts.getXsrfToken(gProp)
        }
    };

    stores.common
        .login({
            url: url,
            body: body,
            options: options,
            gProp: gProp,
            signInError: signInError
        })
        .then(() => {
            commonts.debugLog(gProp, ['login -> ', stores.common.isAuthenticated]);
            if (popupFlag.value) {
                emit('close');
            } else {
                if (stores.common.isAuthenticated) {
                    if (toUrl?.value !== undefined) {
                        router?.push(toUrl.value);
                    } else {
                        router?.push('/');
                    }
                } else {
                    commonts.debugLog(gProp, 'go login!!!');
                    router?.push('/login');
                }
            }
        });
}

function checkMfaTypeAndStatus() {
    let url = commonts.getUrl(gProp, '/api/webui/mfa/authtype');

    gProp?.axios
        .post(url, user_id.value, getAxiosOptions('DATA', {}))
        .then(function (response: any) {
            commonts.debugLog(gProp, response.data);
            commonts.debugLog(gProp, response.data.auth_type);
            if (response.data.auth_type === 'ath') {
                if (response.data.status === '0000') {
                    doAthRegistOtp();
                } else if (response.data.status === '0100') {
                    doAthOtp();
                } else {
                    commonts.notificationShow(gProp, 'error', t('voca.msg.error.default'));
                }
            } else if (response.data.auth_type === 'iat') {
                // IAT 상태처리 값 기능 추가 요망
            }
        })
        .catch((error: any) => {
            commonts.debugLog(gProp, error.response);
            commonts.notificationShow(gProp, 'error', t('msg.error.info.login.default'));
        })
        .finally(getFinallyFunc);
}

function doAthOtp() {
    commonts.debugLog(gProp, 'doOtp');
    userInfo.value = { userId: user_id.value, athOtpFlag: true };
    commonts.setDetailInfo(stores, userInfo);
    commonts.showModal(refAthOtp?.value?.$el);
}

function doAthRegistOtp() {
    commonts.debugLog(gProp, 'AthRegistOtp');
    userInfo.value = { userId: user_id.value, athRegOtpFlag: true };
    commonts.setDetailInfo(stores, userInfo);
    commonts.showModal(refAthOtpRegister?.value?.$el);
}

function enterOnPassword(e: KeyboardEvent) {
    if (e.code === 'Enter') {
        doLogin();
    }
}

function register() {
    commonts.debugLog(gProp, 'register');
    commonts.showModal(registerModal.value, 200);
}

function forgetPassword() {
    commonts.debugLog(gProp, 'forgetPassword');
    commonts.showModal(resetPasswordModal.value, 200);
}

function idRestore() {
    let init = localStorage.getItem('login_init');
    if (init !== null && init !== undefined && init !== '') {
        login_init.save_flag = JSON.parse(init).save_flag;
        login_init.id = JSON.parse(init).id;
        if (login_init.save_flag) {
            user_id.value = login_init.id;
        }
    }
}

onMounted(() => {
    commonts.hideLoading();
    commonts.initPage({ docNameId: docName });

    registerModal.value = commonts.makeModal(registerId);
    resetPasswordModal.value = commonts.makeModal(resetPasswordId);

    idRestore();
});
onUpdated(() => {
    commonts.hideLoading();
});
onUnmounted(() => {});

if (!popupFlag.value) {
    emitter.emit('view-flag', { header: false, footer: false });
}
</script>

<style scoped>
a.dropdown-toggle::before,
.dropdown-toggle::after {
    display: none;
}
</style>
