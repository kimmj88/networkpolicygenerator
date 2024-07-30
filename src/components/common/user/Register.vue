<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div class="mt-3">
                    <form>
                        <MoleInput
                            class="px-3 mb-2"
                            :class-text="classText + ' required email'"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.user.id.default')"
                            v-model="dataInfo.user_id"
                            :readonly="true"
                            :tabindex="tabIdx.detIn + 1"
                        />
                        <MoleInput
                            :input-type="'password'"
                            class="px-3 mb-2"
                            :class-text="classText + ' required password'"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.password.default')"
                            v-model="dataInfo.user_pw"
                            :tabindex="tabIdx.detIn + 2"
                        />
                        <MoleInput
                            :input-type="'password'"
                            class="px-3 mb-2"
                            :class-text="classText + ' required password'"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.password.confirm.default')"
                            v-model="dataInfo.user_pw_confirm"
                            :tabindex="tabIdx.detIn + 3"
                        />
                        <MoleInput
                            class="px-3 mb-2"
                            :class-text="classText + ' required string'"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.user.name.default')"
                            v-model="dataInfo.user_nm"
                            :tabindex="tabIdx.detIn + 4"
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
                        :button-name="'btn.registration.default'"
                        @click="goCreateUserConfirm"
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
import TemplateBase from '@o/TemplateBase.vue';
import { onMounted, onUpdated, reactive } from 'vue';

const props = defineProps({
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
const { svcType, tabIdx } = commonVar();

const docName = 'Register';

const dataInfo = reactive({
    svc_type: svcType.value,
    user_id: '',
    user_nm: '',
    user_pw: '',
    user_pw_confirm: ''
} as any);

const emit = defineEmits(['close']);

function closeModal() {
    if (props.popupCloseFunc !== undefined) {
        props.popupCloseFunc(1);
    }

    emit('close');
}

function goCreateUserConfirm() {
    // data validation
    if (!commonts.validator(gProp, docName)) {
        return false;
    }

    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.registration.default'),
        method: 'YN',
        cbFunc: doCreateUserProcess
    });
}

function doCreateUserProcess(retVal: boolean) {
    if (retVal) {
        doCreateUser();
    }
    return false;
}

function doCreateUser() {
    // 신규 암호와 confirm 데이터가 같은지 확인
    if (dataInfo.user_pw !== dataInfo.user_pw_confirm) {
        commonts.notificationShow(gProp, 'error', t('msg.error.wrong_input.password.default'));
        let target = document.querySelector('#' + docName)?.querySelector('#pw_confirm');
        if (target !== null && target !== undefined && target instanceof HTMLInputElement) {
            target.value = '';
            target.focus();
        }
        return false;
    }

    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/api/webui/user'), dataInfo, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                commonts.debugLog(gProp, response.data);
                commonts.notificationShow(gProp, 'success', t('msg.info.registration.user.id.default'));
                closeModal();
            })
            .catch((error: any) => {
                commonts.debugLog(gProp, error);
                commonts.notificationShow(gProp, 'error', t('msg.error.create.registration.default'));
            })
            .finally(getFinallyFunc);
    }
}

onMounted(() => {
    commonts.initPage({ docNameId: docName });
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    commonts.initPage({ docNameId: docName });
});
</script>
