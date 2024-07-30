<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div :class="cardClass" class="mb-3">
                    <CommanderKeyGroupDetail
                        :popup-flag="popupFlag"
                        :detail-id="detailInfo?.id"
                        @click:save="doSave"
                        @click:delete="doDeleteConfirm"
                        @click:list="goList"
                    />
                </div>
                <div :class="cardClass" class="mb-3">
                    <MoleInput
                        class="px-3 h-12"
                        :class-text="classText + ' required string'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.key.group.name.default')"
                        v-model="dataInfo.group_name"
                    />
                </div>
                <div class="mt-2" :class="cardClass">
                    <div class="px-3 h-12 inline-flex flex-row items-center justify-around w-full">
                        <AtomLabel
                            class="basis-1/3 pr-2 ml-2"
                            :class-text="labelClassText"
                            :label-text="'키방식'"
                        ></AtomLabel>
                        <div class="basis-2/3 mr-2 inline-flex flex-row items-center justify-items-start w-full">
                            <template v-for="(entry, idx) in commonCode.cmm103" :key="entry.cm_cd">
                                <AtomInput
                                    :class="idx > 0 ? 'ml-4' : ''"
                                    :class-text="classText + ' required radio'"
                                    :name="keyTypeRadioName"
                                    :model-value="entry.cm_cd"
                                    :input-type="'radio'"
                                    :label-text="t('voca.' + entry.cm_cd.toLowerCase() + '.key.default')"
                                    :label-class-text="labelClassText + ' ml-2 w-max'"
                                />
                            </template>
                        </div>
                    </div>
                    <MoleSelect
                        class="px-3 h-12"
                        :class-text="'required select single'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.key.name.default')"
                        :options="kmsKeysList"
                        :get-option-label="(option: any) => setEmptyMsg(option, option?.key + ' - ' + option?.type)"
                        :reduce="(option: any) => option?.key"
                        v-model="dataInfo.key_name"
                    />
                    <MoleInput
                        class="px-3 h-12"
                        :class-text="classText + ' required number'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.create.count.default')"
                        :min="1"
                        v-model="dataInfo.key_cnt"
                    />
                    <div class="w-full px-3 py-1.5 inline-flex justify-end align-middle">
                        <AtomButton
                            v-if="authCreateUpdate"
                            :type="'create'"
                            :class="btnClass"
                            :class-text="listBtnClassText"
                            :button-name="'btn.key.add.default'"
                            @click="doKeyAddConfirm"
                            :tabindex="tabIdx.lstIn"
                        />
                    </div>
                </div>
                <div class="mt-2 rounded-b-lg h-[20rem]" :class="cardClass">
                    <DataListKeys
                        :data-list="dataInfo.keys"
                        :common-code="commonCode"
                        :kms-keys="kmsKeys"
                        @click:delete="doKeyDelete"
                    />
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
import type { KeyType, ListItemType } from '@/types/types';
import AtomButton from '@a/Button.vue';
import AtomInput from '@a/Input.vue';
import AtomLabel from '@a/Label.vue';
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import TemplateBase from '@o/TemplateBase.vue';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, reactive, ref, type Ref } from 'vue';
import CommanderKeyGroupDetail from './include/CommanderKeyGroupDetail.vue';
import DataListKeys from './include/DataListKeys.vue';

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

const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';
const labelClassText = 'text-black w-full text-base';
const classText = 'text-black w-full text-base';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';
const listBtnClassText = 'w-full text-base rounded-md px-2 py-1.5 focus:outline-none hover:brightness-75';

const { stores, emitter, gProp, commonts, router, t } = base();
const { authCreateUpdate } = auth();
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();
const { svcType, tabIdx, commonCode, setEmptyMsg } = commonVar();

const docName = 'KeyGroupDetail';

const keyTypeRadioName = 'keyTypeRadio';

const popupFlag = ref(props.popupFlag);
const dataFlag = ref(!(props.detailInfo?.value?.id === undefined || props.detailInfo?.value?.id === ''));
const userInfo = computed(() => stores.user.user);

const kmsKeys: Ref<KeyType[]> = ref([]);
const kmsKeysList = ref(getKmsKeysList());

function getKmsKeysList() {
    let keyType = getRadioValue(keyTypeRadioName);

    let retAllArray: KeyType[] = [];
    let retAsymmArray: KeyType[] = [];
    let retSymmArray: KeyType[] = [];

    kmsKeys?.value?.forEach((key: KeyType) => {
        if (key.type === 'PUBLIC') {
            retAsymmArray.push(key);
        } else if (key.type === 'SECRET') {
            retSymmArray.push(key);
        }
        retAllArray.push(key);
    });

    if (keyType === 'PUBLIC') {
        return retAsymmArray;
    } else if (keyType === 'SYMMETRIC') {
        return retSymmArray;
    } else {
        return retAllArray;
    }
}

const keys = ref(props.detailInfo?.keys ?? ([] as Array<ListItemType>));

const dataInfo = reactive({
    svc_type: svcType.value,
    group_name: '',
    key_type: '',
    key_name: '',
    key_cnt: '1',
    keys: keys
} as any);

const emit = defineEmits(['close']);

function doKeyAddConfirm() {
    // data validation
    if (!commonts.validator(gProp, docName)) {
        return false;
    }

    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.registration.default'),
        method: 'YN',
        cbFunc: doKeyAddProcess
    });
}

function doKeyAddProcess(retVal: boolean) {
    if (retVal) {
        doKeyAdd();
    }

    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
    // dataInfo.group_name = '',
    dataInfo.key_type = '';
    dataInfo.key_name = '';
    dataInfo.key_cnt = '1';
}

function initRadioTag(name: string) {
    let ret = [] as any;
    let target = document.getElementsByName(name);
    console.log(dataInfo.key_type);
    let completeFlag = false;
    dataInfo.key_type.split(',').forEach((keyType: string) => {
        target.forEach((t) => {
            if (t.classList.contains('complete')) {
                t.classList.remove('complete');
            }

            if ((t as HTMLInputElement).value === keyType) {
                (t as HTMLInputElement).checked = true;
                completeFlag = true;
            } else {
                (t as HTMLInputElement).checked = false;
            }

            if (!t.classList.contains('complete') && completeFlag) {
                t.classList.add('complete');
            }
        });
    });
    return ret[0];
}

function getRadioValue(name: string) {
    let ret = [] as any;
    let target = document.getElementsByName(name);
    target.forEach((t) => {
        // console.log(t, (t as HTMLInputElement).checked);
        if ((t as HTMLInputElement).checked === true) {
            ret.push((t as HTMLInputElement).value);
        }
    });
    return ret[0];
}

function doKeyAdd() {
    console.log(getRadioValue(keyTypeRadioName));
    let addDataSet = {
        svc_type: dataInfo.svc_type,
        group_name: dataInfo.group_name,
        key_type: getRadioValue(keyTypeRadioName),
        key_name: dataInfo.key_name,
        key_cnt: 1,
        create_id: userInfo?.value.email,
        create_time: ''
    };

    console.log(dataInfo.keys);
    if (dataInfo.keys === null || dataInfo.keys === undefined) {
        dataInfo.keys = [] as Array<ListItemType>;
    }
    dataInfo.keys.push(addDataSet);
}

function doKeyDelete(id: string) {
    console.log('doKeyDelete', id);
}

function goList() {
    commonts.debugLog(gProp, 'goList');
    if (!popupFlag.value) {
        router?.replace({ path: '/keygroup/list' });
    } else {
        commonts.debugLog(gProp, props.popupCloseFunc);
        if (props.popupCloseFunc !== undefined) {
            props.popupCloseFunc(1);
        }
        emit('close');
    }
}

function doDetail() {
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/keygroup/group/detail'), dataInfo, getAxiosOptions('DATA'))
            .then(function (response: any) {
                Object.assign(dataInfo, response.data);
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function doSave() {
    // data validation
    if (!commonts.validator(gProp, docName)) {
        return false;
    }

    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;

        let url = dataFlag.value
            ? commonts.getUrl(gProp, '/keygroup/group/update')
            : commonts.getUrl(gProp, '/keygroup/group/insert');

        gProp?.axios
            .post(url, dataInfo, getAxiosOptions('DATA'))
            .then(() => {
                commonts.notificationShow(gProp, 'success', t('msg.info.save.default'));
                goList();
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
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

function doDeleteProcess(retVal: boolean) {
    if (retVal) {
        doDelete();
    }
    return false;
}

function doDelete() {
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/keygroup/group/delete'), dataInfo, getAxiosOptions('DATA'))
            .then(() => {
                commonts.notificationShow(gProp, 'success', t('msg.info.delete.default'));
                goList();
            })
            .catch(function (error: any) {
                commonts.debugLog(gProp, error);
                commonts.notificationShow(gProp, 'error', t('msg.error.delete.default'));
                return false;
            })
            .finally(getFinallyFunc);
    }
}

function nextProcess() {
    console.log(getRadioValue(keyTypeRadioName));
    if (!commonts.isEmpty(dataInfo?.id)) {
        commonts.debugLog(gProp, 'nextProcess doDetail');
        doDetail();
    }
    initRadioTag(keyTypeRadioName);
}

function initDataDetail() {
    if (popupFlag.value) {
        // popup 처리시 stores.common.detailInfo에 인자가 있으면(데이터가 있으면) 값을 업데이트 하고 stores.common.detailInfo 는 초기화함
        if (Object.keys(stores.common.detailInfo).length > 0) {
            Object.assign(dataInfo, stores.common.detailInfo);
            dataFlag.value = dataInfo?.id !== undefined && dataInfo?.id !== '';
            commonts.setInitDetailInfo(stores);
            nextProcess();
        }
    }
}

onBeforeMount(() => {
    gProp?.axios.all([commonts.getCmCds(gProp, ['CMM103', 'CMM900'], ''), commonts.getKmsKeyList(gProp)]).then(
        gProp?.axios.spread((cmmList: { [x: string]: Array<{ [x: string]: any }> }, kmsKeyList: KeyType[]) => {
            Object.keys(cmmList).forEach((key: string) => (commonCode[key.toLowerCase()] = cmmList[key]));
            kmsKeys.value = kmsKeyList;
            if (!popupFlag.value) {
                nextProcess();
            }
        })
    );
});

onMounted(() => {
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

onBeforeUnmount(() => {});
</script>
