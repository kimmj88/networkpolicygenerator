<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div class="flex flex-col gap-4 relative">
                    <div class="flex flex-col gap-4">
                        <!-- Title -->
                        <div :class="cardClass" class="flex items-center justify-between p-3">
                            <div class="text-xl font-medium flex justify-between">
                                {{ !rulesetStore.id ? 'New Ruleset' : 'Edit Ruleset' }}
                            </div>
                            <div class="flex items-end justify-items-end gap-2">
                                <AtomButton :type="'create'" :button-name="t('btn.save.default')" @click="upsertRule" />
                                <AtomButton
                                    v-if="rulesetStore.id"
                                    :type="'delete'"
                                    :button-name="t('btn.delete.default')"
                                    @click="doDeleteConfirm"
                                />
                                <AtomButton :type="'list'" :button-name="t('btn.list.default')" @click="backToList" />
                            </div>
                        </div>
                        <!-- Input Content -->
                        <div :class="cardClass" class="p-4 flex flex-col gap-2">
                            <MoleInput
                                :label-class-text="labelClassText"
                                :label-text="t('voca.title.default')"
                                :class-text="classText + ' required text'"
                                v-model="rulesetStore.title"
                            />
                            <MoleInput
                                :label-class-text="labelClassText"
                                :label-text="t('voca.description.default')"
                                :class-text="classText"
                                v-model="rulesetStore.description"
                            />
                            <RulesTable />
                        </div>
                        <div v-if="!rulesetStore.selectedRuleId" :class="`${cardClass} p-4 font-medium text-lg`">
                            Please select at least one rule first.
                        </div>
                        <div v-else :class="`${cardClass} p-4`">
                            <RuleDetail />
                        </div>
                    </div>
                </div>
            </template>
        </TemplateBase>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { auth } from '@/plugins/ts/auth';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import AtomButton from '@a/Button.vue';
import MoleInput from '@m/InputWithLabel.vue';
import TemplateBase from '@o/TemplateBase.vue';
import RulesTable from './include/RulesTable.vue';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, reactive, ref, type Ref } from 'vue';
import { rulesetStore } from '@/stores/modules/Ruleset';
import RuleDetail from '../rule/RuleDetail.vue';
import { ruleStore } from '@/stores/modules/Rule';
import { PrismaErrorCode } from '@cm/enum/errorCode';

// const { rule_base } = storeToRefs(rulesetStore);

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
const classText = 'text-black w-full text-base';

const { stores, emitter, gProp, commonts, router, t } = base();
const { authCreateUpdate } = auth();
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();
const { svcType, tabIdx, commonCode, setEmptyMsg, setCodeMsg } = commonVar();

const docName = 'RuleDetail';

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

async function upsertRule() {
    const targetUrl = !rulesetStore.id ? '/ruleset/insert' : '/ruleset/update';
    const { result, code, meta } = await rulesetStore.upsertRuleset(commonts.getUrl(gProp, targetUrl));
    if (result) {
        commonts.notificationShow(
            gProp,
            'success',
            t('msg.info.create.successfully.args.default', [t('voca.ruleset.default')]),
            -1
        );
        backToList();
    } else {
        if (code === PrismaErrorCode.UniqueConstraintFailed) {
            const duplicatedField = meta.target;
            if (duplicatedField) {
                commonts.notificationShow(
                    gProp,
                    'error',
                    t('msg.error.wrong_input.duplicate.args.default', [duplicatedField]),
                    -1
                );
            } else {
                commonts.notificationShow(gProp, 'error', t('msg.error.wrong_input.duplicate.default'), -1);
            }
        } else {
            commonts.notificationShow(
                gProp,
                'error',
                t('msg.error.fail.create.args.default', [t('voca.ruleset.default')]),
                -1
            );
        }
        return;
    }
}

function doDeleteConfirm() {
    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.delete.default'),
        method: 'YN',
        cbFunc: doDeleteProcess
    });
}

async function doDeleteProcess(retVal: boolean) {
    if (retVal) {
        await deleteRuleset();
    }
    return false;
}

async function deleteRuleset() {
    const searchData = {
        id: rulesetStore.id
    };
    gProp?.axios
        .post(commonts.getUrl(gProp, '/ruleset/delete'), searchData, getAxiosOptions('DATA', {}))
        .then(({ data }: any) => {
            if (data.message.code === PrismaErrorCode.FKConstraintFailed) {
                commonts.notificationShow(
                    gProp,
                    'error',
                    t('msg.error.delete.not_allow.in_use.args.default', [t('voca.ruleset.default')])
                );
                return;
            }
            commonts.notificationShow(gProp, 'success', t('msg.info.delete.default'));
            backToList();
            return data;
        })
        .catch(getErrorFunc)
        .finally(getFinallyFunc);
}

async function backToList() {
    rulesetStore.initAll();
    router?.push('/npg/rule/ruleset/list');
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
    window.ipcRenderer.on([channel, 'return'].join('_'), (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[(key as string).toLowerCase()] = ret[key]));
        nextProcess();
    });

    if (rulesetStore.id) {
        await rulesetStore.getDetail();
    } else {
        rulesetStore.initAll();
    }
});

onMounted(() => {
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

onBeforeUnmount(() => {
    setTimeout(() => {
        rulesetStore.initAll();
        ruleStore.initAll();
    }, 0);
});
</script>

<style lang="scss" scoped></style>
