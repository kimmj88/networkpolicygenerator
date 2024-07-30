<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div class="mt-3">
                    <form>
                        <MoleSelect
                            v-if="svcType === 'ALL'"
                            class="px-3 mb-2"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.service.type.default')"
                            :options="commonCode.cmm001"
                            v-model="dataInfo.svc_type"
                            :placeholder="$t('msg.info.select.default')"
                            :get-option-label="(option: any) => setEmptyMsg(option, option?.cm_cd)"
                            :reduce="(option: any) => option?.cm_cd"
                            :disabled="dataFlag"
                            :tabindex="tabIdx.detIn"
                        />
                        <MoleInput
                            class="px-3 mb-2"
                            :class-text="classText + ' required string'"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.user.id.default')"
                            v-model="dataInfo.user_id"
                            :readonly="dataFlag"
                            :tabindex="tabIdx.detIn + 1"
                        />
                        <MoleInput
                            class="px-3 mb-2"
                            :class-text="classText + ' required string'"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.user.name.default')"
                            v-model="dataInfo.user_nm"
                            :readonly="dataFlag"
                            :tabindex="tabIdx.detIn + 2"
                        />
                        <MoleInput
                            :input-type="'password'"
                            class="px-3 mb-2"
                            :class-text="classText + ' required password'"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.password.current.default')"
                            v-model="dataInfo.user_pw"
                            :tabindex="tabIdx.detIn + 3"
                        />
                        <MoleInput
                            :input-type="'password'"
                            class="px-3 mb-2"
                            :class-text="classText + ' required password'"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.password.new.default')"
                            v-model="dataInfo.new_pw"
                            :tabindex="tabIdx.detIn + 4"
                        />
                        <MoleInput
                            :input-type="'password'"
                            class="px-3 mb-2"
                            :class-text="classText + ' required password'"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.password.new.confirm.default')"
                            v-model="dataInfo.new_pw_confirm"
                            :tabindex="tabIdx.detIn + 5"
                        />
                    </form>
                </div>
            </template>
            <template v-slot:footer>
                <div class="m-3">
                    <AtomButton
                        :type="'save'"
                        :class="btnClass"
                        :class-text="classText"
                        :button-name="'btn.password.change.default'"
                        @click="goChangePasswordConfirm"
                        :tabindex="tabIdx.detBtn"
                    />
                </div>
            </template>
        </TemplateBase>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import AtomButton from '@a/Button.vue';
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import TemplateBase from '@o/TemplateBase.vue';
import { computed, onMounted, onUpdated, reactive, ref } from 'vue';

const props = defineProps({
    userId: String,
    userNm: String,
    popupFlag: {
        type: Boolean,
        default: false
    },
    popupCloseFunc: Function
});

const labelClassText = 'text-black w-full h-10 text-base font-bold';
const classText =
    'w-full h-10 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75 min-w-[7rem] min-h-[3rem]';
const btnClass = 'mx-3';

const { emitter, gProp, commonts, t } = base();
const { isAxiosFlag, getAxiosOptions, getFinallyFunc } = axios();
const { svcType, tabIdx, commonCode, setEmptyMsg } = commonVar();

const docName = 'AccountChange';

const userId = computed(() => props.userId);
const userNm = computed(() => props.userNm);

const dataFlag = ref(true);

const dataInfo = reactive({
    svc_type: svcType.value,
    user_id: userId,
    user_nm: userNm,
    user_pw: '',
    new_pw: '',
    new_pw_confirm: ''
} as any);

const emit = defineEmits(['close']);

function closeModal() {
    if (props.popupCloseFunc !== undefined) {
        props.popupCloseFunc(1);
    }

    emit('close');
}

function goChangePasswordConfirm() {
    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.save'),
        method: 'YN',
        cbFunc: doChangePasswordProcess
    });
}

function doChangePasswordProcess(retVal: boolean) {
    if (retVal) {
        doChangePassword();
    }
    return false;
}

function doChangePassword() {
    // data validation
    if (!commonts.validator(gProp, docName)) {
        return false;
    }
    // 신규 암호와 confirm 데이터가 같은지 확인
    if (dataInfo.new_pw !== dataInfo.new_pw_confirm) {
        commonts.notificationShow(gProp, 'error', t('msg.error.wrong_input.password.default'));
        let target = document.querySelector('#' + docName)?.querySelector('#new_pw_confirm');
        if (target !== null && target !== undefined && target instanceof HTMLInputElement) {
            target.value = '';
            target.focus();
        }
        return false;
    }

    api_change_password();
}

function api_change_password() {
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/api/webui/user/password'), dataInfo, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                commonts.debugLog(gProp, response.data);
                commonts.notificationShow(gProp, 'success', t('msg.info.apply.default'));
                closeModal();
            })
            .catch((error: any) => {
                console.log(error);
                return false;
            })
            .finally(getFinallyFunc);
    }
}

onMounted(() => {
    commonts.initPage({ docNameId: docName });
});

onUpdated(() => {
    commonts.initPage({ docNameId: docName });
});
</script>
