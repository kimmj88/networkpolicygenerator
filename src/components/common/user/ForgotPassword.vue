<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div class="mt-3">
                    <form>
                        <MoleInput
                            class="px-3 mb-2"
                            :class-text="classText"
                            :label-class-text="labelClassText"
                            :label-text="t('voca.email.default')"
                            v-model="email"
                            @keyup.enter="forgotpassword"
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
                        :button-name="'btn.save.default'"
                        @click="forgotpassword"
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
import { onMounted, onUpdated, ref } from 'vue';

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

const { gProp, commonts, t } = base();
const { isAxiosFlag, getAxiosOptions, getFinallyFunc } = axios();
const { tabIdx } = commonVar();

const docName = 'ForgotPassword';

const email = ref('');

const emit = defineEmits(['close']);

function closeModal() {
    if (props.popupCloseFunc !== undefined) {
        props.popupCloseFunc(1);
    }

    emit('close');
}

function forgotpassword() {
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(
                commonts.getUrl(gProp, '/api/webui/user/reset-password/id/' + email.value),
                {},
                getAxiosOptions('DATA', {})
            )
            .then(function (response: any) {
                commonts.debugLog(gProp, response.data);
                commonts.notificationShow(gProp, 'success', t('msg.info.apply.default'));
                closeModal();
            })
            .catch((error: any) => {
                commonts.debugLog(gProp, error);
                return false;
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
