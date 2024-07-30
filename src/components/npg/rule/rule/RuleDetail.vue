<template>
    <form :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div class="flex flex-col gap-4 relative">
                    <div class="flex flex-col gap-4">
                        <!-- Title -->
                        <div :class="`${cardClass} flex justify-between items-center`">
                            <div class="text-xl font-medium p-4">
                                {{ !ruleStore.id ? t('voca.rule.new.default') : t('voca.rule.detail.default') }}
                            </div>
                            <RuleDetailCommander />
                        </div>
                        <!-- Input Content -->
                        <div :class="cardClass" class="p-4 flex flex-col gap-2">
                            <MoleInput
                                :class-text="classText + ' required text'"
                                :label-class-text="labelClassText"
                                :label-text="t('voca.title.default')"
                                v-model="rule_base.title"
                            />
                            <MoleSelect
                                :label-class-text="labelClassText"
                                :label-text="t('voca.action.default')"
                                :class-text="'required select single'"
                                :place-holder="t('msg.info.select.default')"
                                :options="commonCode?.cmm200"
                                :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                                :reduce="(option: any) => option?.cd"
                                v-model="rule_base.action"
                            />
                        </div>
                    </div>
                    <RuleHeader :common-code="commonCode"></RuleHeader>
                    <RuleBasicOption />
                    <RulePayload :common-code="commonCode" />
                    <RuleNonPayload :common-code="commonCode" />
                    <RulePostDetection :common-code="commonCode" />
                    <RulePreview />
                </div>
            </template>
        </TemplateBase>
    </form>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { auth } from '@/plugins/ts/auth';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { ruleStore } from '@/stores/modules/Rule';
import ValidationInputWithLabel from '@/components/base/molecules/ValidationInputWithLabel.vue';
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import TemplateBase from '@o/TemplateBase.vue';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, Ref, ref } from 'vue';
import RuleBasicOption from './include/RuleBasicOption.vue';
import RuleHeader from './include/RuleHeader.vue';
import RuleNonPayload from './include/RuleNonPayload.vue';
import RulePayload from './include/RulePayload.vue';
import RulePostDetection from './include/RulePostDetection.vue';
import RulePreview from './include/RulePreview.vue';
import RuleDetailCommander from './include/RuleDetailCommander.vue';
import { getLengthRegx } from '@/plugins/ts/regex';

const docName = 'RuleDetail';

const { rule_base } = storeToRefs(ruleStore);

const props = defineProps({
    detailInfo: {
        type: Object,
        default: {} as any
    },
    popupFlag: {
        type: Boolean,
        default: false
    },
    popupCloseFunc: Function
});

const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 rounded';
const labelClassText = 'text-black w-full text-base font-medium';
const classText = 'text-black w-full text-base font-medium';

const { stores, emitter, gProp, commonts, router, t } = base();
const { authCreateUpdate } = auth();
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();
const { svcType, tabIdx, commonCode, setEmptyMsg, setCodeMsg } = commonVar();

const popupFlag = ref(props.popupFlag);
const dataFlag = ref(!(props.detailInfo?.value?.id === undefined || props.detailInfo?.value?.id === ''));
const userInfo = computed(() => stores.user.user);

function nextProcess() {
    // console.log(getRadioValue(keyTypeRadioName), dataInfo?.id, dataInfo.key_type)
    // if (!commonts.isEmpty(dataInfo?.id)) {
    //     commonts.debugLog(gProp, 'nextProcess doDetail');
    // doDetail();
    // }
}

function initDataDetail() {
    // if (popupFlag.value) {
    //     // popup 처리시 stores.common.detailInfo에 인자가 있으면(데이터가 있으면) 값을 업데이트 하고 stores.common.detailInfo 는 초기화함
    //     if (Object.keys(stores.common.detailInfo).length > 0) {
    //         Object.assign(dataInfo, stores.common.detailInfo);
    //         dataFlag.value = !(dataInfo?.id === undefined || dataInfo?.id === '');
    //         commonts.setInitDetailInfo(stores);
    //         nextProcess();
    //     }
    // }
}

onBeforeMount(async () => {
    /**
     * 200: Rule Actions
     * 201: Protocol Types
     * 202: Direction Operator
     * 203: IP, Port Type,
     * 204: content-modifer type
     */
    let grpCds = [
        'CMM001',
        'CMM200',
        'CMM201',
        'CMM202',
        'CMM203',
        'CMM204',
        'CMM205',
        'CMM206',
        'CMM207',
        'CMM208',
        'CMM209',
        'CMM210',
        'CMM211',
        'CMM212',
        'CMM213',
        'CMM214',
        'CMM215',
        'CMM901',
        'CMM902'
    ];
    const channel = 'mng_code_lists';
    window.ipcRenderer.send(channel, {
        grp_cd: grpCds.join(','),
        use_yn: 'Y',
        sort: 'sort_order asc'
    });
    // list 화면에 popup으로 detail이 들어가는 경우 코드 리스트 조회 ipc 세팅시 detail 쪽은 once 대신 on 으로 세팅한다
    window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[(key as string).toLowerCase()] = ret[key]));
        nextProcess();
    });

    if (ruleStore.id) {
        await ruleStore.initAll(true);
        await ruleStore.getRuleDetail();
    } else {
        await ruleStore.initAll();
    }
});

onMounted(() => {
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

onBeforeUnmount(async () => {
    await ruleStore.initAll();
});
</script>

<style lang="scss" scoped></style>
