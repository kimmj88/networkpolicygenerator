<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:header>
                <div class="flex items-center justify-between p-3">
                    <div class="label"></div>
                    <div class="commandBtn flex items-end justify-items-end">
                        <AtomButton
                            v-if="authCreateUpdate"
                            :type="'save'"
                            :class="btnClass"
                            :class-text="classText"
                            :button-name="'btn.save.default'"
                            @click="doSave"
                            :tabindex="tabIdx.detBtn"
                        />
                        <AtomButton
                            v-if="authDelete && dataFlag"
                            :type="'delete'"
                            :class="btnClass"
                            :class-text="classText"
                            :button-name="'btn.delete.default'"
                            @click="doDeleteConfirm"
                            :tabindex="tabIdx.detBtn + 1"
                        />
                        <AtomButton
                            v-if="authRead && !popupFlag"
                            :type="'list'"
                            :class="btnClass"
                            :class-text="classText + ' bxc bxc-list-ul'"
                            :button-name="getDocListBtnName()"
                            @click="goList"
                            :tabindex="tabIdx.detBtn + 2"
                        />
                    </div>
                </div>
            </template>
            <template v-slot:body>
                <div>
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
                        :label-text="t('voca.auth.id.default')"
                        v-model="dataInfo.auth_id"
                        :readonly="dataFlag"
                        :tabindex="tabIdx.detIn + 1"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText + ' required string'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.auth.name.default')"
                        v-model="dataInfo.auth_nm"
                        :readonly="dataFlag"
                        :tabindex="tabIdx.detIn + 2"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText + ' required string'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.auth.description.default')"
                        v-model="dataInfo.auth_dc"
                        :readonly="dataFlag"
                        :tabindex="tabIdx.detIn + 3"
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
import AtomButton from '@a/Button.vue';
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import TemplateBase from '@o/TemplateBase.vue';
import { onBeforeMount, onMounted, onUpdated, reactive, ref } from 'vue';

const props = defineProps({
    detailInfo: Object,
    popupFlag: {
        type: Boolean,
        default: false
    },
    popupCloseFunc: Function
});

const labelClassText = 'text-black w-full h-10 text-base font-bold';
const classText = 'text-black w-full h-10 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';

const { stores, emitter, gProp, commonts, router, t } = base();
const { authRead, authDelete, authCreateUpdate } = auth();
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();
const { svcType, tabIdx, commonCode, setEmptyMsg } = commonVar();

const docName = 'AuthDetail';

const popupFlag = ref(props.popupFlag);
const authId = ref(props.detailInfo?.value?.auth_id === undefined ? '' : props.detailInfo?.value?.auth_id);

const dataFlag = ref(props.detailInfo?.value?.auth_id !== undefined && props.detailInfo?.value?.auth_id !== '');

const dataInfo = reactive({
    svc_type: svcType.value,
    auth_id: authId,
    auth_nm: '',
    auth_dc: '',
    use_yn: true
});

const emit = defineEmits(['close']);

function goList() {
    commonts.debugLog(gProp, 'goList');
    if (!popupFlag.value) {
        router?.replace({ path: '/auth/list' });
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
            .post(commonts.getUrl(gProp, '/management/auth/detail'), dataInfo, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                commonts.debugLog(gProp, response);
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
            ? commonts.getUrl(gProp, '/management/auth/update')
            : commonts.getUrl(gProp, '/management/auth/insert');

        gProp?.axios
            .post(url, dataInfo, getAxiosOptions('DATA', {}))
            .then(function () {
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
            .post(commonts.getUrl(gProp, '/management/auth/delete'), dataInfo, getAxiosOptions('DATA', {}))
            .then(function () {
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

function getDocListBtnName() {
    return popupFlag.value ? 'btn.close.default' : 'btn.list.default';
}

function nextProcess() {
    if (!commonts.isEmpty(dataInfo?.auth_id)) {
        doDetail();
    }
}

function initDataDetail() {
    if (popupFlag.value) {
        // popup 처리시 stores.common.detailInfo에 인자가 있으면(데이터가 있으면) 값을 업데이트 하고 stores.common.detailInfo 는 초기화함
        if (Object.keys(stores.common.detailInfo).length > 0) {
            Object.assign(dataInfo, stores.common.detailInfo);
            commonts.setInitDetailInfo(stores);
            dataFlag.value = dataInfo?.auth_id !== undefined && dataInfo?.auth_id !== '';
            nextProcess();
        }
    }
}
onBeforeMount(() => {
    gProp?.axios.all([commonts.getCmCds(gProp, ['CMM001', 'CMM901', 'CMM906'], '')]).then(
        gProp?.axios.spread((cmmList: { [x: string]: Array<{ [x: string]: any }> }) => {
            Object.keys(cmmList).forEach((key: string) => (commonCode[key.toLowerCase()] = cmmList[key]));
            nextProcess();
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
</script>
