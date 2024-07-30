<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div :class="cardClass">
                    <CommanderGrpCodeDetail
                        :popup-flag="popupFlag"
                        :detail-id="dataInfo?.id"
                        @click:save="doSave"
                        @click:delete="doDeleteConfirm"
                    />
                </div>
                <div :class="cardClass" class="pt-3">
                    <MoleSelect
                        v-if="svcType === 'ALL'"
                        class="px-3 mb-2"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.service.type.default')"
                        :options="commonCode.cmm001"
                        v-model="dataInfo.svc_type"
                        :placeholder="$t('msg.info.select.default')"
                        :get-option-label="(option: any) => setEmptyMsg(option, option?.cd)"
                        :reduce="(option: any) => option?.cd"
                        :disabled="dataFlag"
                        :tabindex="tabIdx.detIn"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText + ' required string'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.group.code.default')"
                        v-model="dataInfo.grp_cd"
                        :readonly="dataFlag"
                        :tabindex="tabIdx.detIn + 1"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText + ' required string'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.group.code.name.default')"
                        v-model="dataInfo.grp_cd_nm"
                        :tabindex="tabIdx.detIn + 2"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText + ' required text'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.group.code.description.default')"
                        v-model="dataInfo.grp_cd_dc"
                        :tabindex="tabIdx.detIn + 3"
                    />
                    <MoleSwitch
                        class="px-3 mb-2"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.use.yn.default')"
                        v-model="dataInfo.use_yn"
                        :able-text="t('voca.use.y.default')"
                        :disable-text="t('voca.use.n.default')"
                        :tabindex="tabIdx.detIn + 4"
                    />
                    <!-- <input
                        class="form-check-input"
                        type="checkbox"
                        id="cs_use_yn"
                        v-model.trim.lazy="dataInfo.use_yn"
                        :tabindex="tabIdx.detIn + 4"
                        true-value="Y"
                        false-value="N"
                    />
                    <label class="form-check-label" for="cs_use_yn">
                        {{
                            t(
                                (
                                    "voca.use." +
                                    ("" + dataInfo?.use_yn === "true" ||
                                    "" + dataInfo?.use_yn === "Y"
                                        ? "Y"
                                        : "N") + '.default'
                                ).toLowerCase()
                            )
                        }}
                    </label> -->
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
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import MoleSwitch from '@m/SwitchWithLabel.vue';
import TemplateBase from '@o/TemplateBase.vue';
import { onBeforeMount, onMounted, onUpdated, reactive, ref } from 'vue';
import CommanderGrpCodeDetail from './include/CommanderGrpCodeDetail.vue';

const props = defineProps({
    detailInfo: Object,
    popupFlag: {
        type: Boolean,
        default: false
    },
    popupCloseFunc: Function
});

const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';
const labelClassText = 'text-black w-full h-10 text-base font-bold';
const classText = 'text-black w-full h-10 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';

const { stores, emitter, gProp, commonts, router, t } = base();
const { authRead, authDelete, authCreateUpdate } = auth();
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();
const { svcType, tabIdx, commonCode, setEmptyMsg } = commonVar();

const docName = 'GrpCodeDetail';

const popupFlag = ref(props.popupFlag);

const id = ref(props.detailInfo?.value?.id === undefined ? '' : props.detailInfo?.value?.id);
const grpCd = ref(props.detailInfo?.value?.grp_cd === undefined ? '' : props.detailInfo?.value?.grp_cd);

const dataFlag = ref(!commonts.isEmpty(props.detailInfo?.value?.id));

const dataInfo = reactive({
    svc_type: svcType.value,
    id: id,
    grp_cd: grpCd,
    grp_cd_nm: '',
    grp_cd_dc: '',
    use_yn: 'Y'
} as any);

const emit = defineEmits(['close']);

function goList() {
    commonts.debugLog(gProp, 'goList');
    if (!popupFlag.value) {
        router?.replace({ path: '/cmgrpcode/list' });
    } else {
        commonts.debugLog(gProp, props.popupCloseFunc);
        if (props.popupCloseFunc !== undefined) {
            props.popupCloseFunc(1);
        }
        emit('close');
    }
}

function doDetail() {
    /**
    // if (!isAxiosFlag.value) {
    //     isAxiosFlag.value = true
    //     gProp?.axios
    //         .post(commonts.getUrl(gProp, '/management/code/grpcode/detail'), dataInfo, getAxiosOptions('DATA', {}))
    //         .then(function (response: any) {
    //             commonts.debugLog(gProp, response)
    //             Object.assign(dataInfo, response.data)
    //         })
    //         .catch(getErrorFunc)
    //         .finally(getFinallyFunc)
    // }
     */
    let channel = 'mng_grp_code_detail';
    window.ipcRenderer.send(channel, JSON.parse(JSON.stringify(dataInfo)));
    window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
        Object.assign(dataInfo, ret);
    });
}

function doSave() {
    // data validation
    if (!commonts.validator(gProp, docName)) {
        return false;
    }

    /**
    // if (!isAxiosFlag.value) {
    //     isAxiosFlag.value = true

    //     let url = dataFlag.value
    //         ? commonts.getUrl(gProp, '/management/code/grpcode/update')
    //         : commonts.getUrl(gProp, '/management/code/grpcode/insert')

    //     gProp?.axios
    //         .post(url, dataInfo, getAxiosOptions('DATA', {}))
    //         .then(function () {
    //             commonts.notificationShow(gProp, 'success', t('msg.info.save.default'))
    //             goList()
    //         })
    //         .catch(getErrorFunc)
    //         .finally(getFinallyFunc)
    // }
     */

    let channel = dataFlag.value ? 'mng_grp_code_update' : 'mng_grp_code_insert';
    window.ipcRenderer.send(channel, JSON.parse(JSON.stringify(dataInfo)));
    window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
        commonts.notificationShow(gProp, 'success', t('msg.info.save.default'));
        goList();
    });
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
    /**
    // if (!isAxiosFlag.value) {
    //     isAxiosFlag.value = true;
    //     gProp?.axios
    //         .post(commonts.getUrl(gProp, '/management/code/grpcode/delete'), dataInfo, getAxiosOptions('DATA', {}))
    //         .then(function () {
    //             commonts.notificationShow(gProp, 'success', t('msg.info.delete.default'));
    //             goList();
    //         })
    //         .catch(function (error: any) {
    //             commonts.debugLog(gProp, error);
    //             commonts.notificationShow(gProp, 'error', t('msg.error.delete.default'));
    //             return false;
    //         })
    //         .finally(getFinallyFunc);
    // }
     */

    let channel = 'mng_grp_code_delete';
    window.ipcRenderer.send(channel, JSON.parse(JSON.stringify(dataInfo)));
    window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
        commonts.notificationShow(gProp, 'success', t('msg.info.delete.default'));
        // commonts.notificationShow(gProp, 'error', t('msg.error.delete.default'));
        goList();
    });
}

function getDocListBtnName() {
    return popupFlag.value ? 'btn.close.default' : 'btn.list.default';
}

function nextProcess() {
    if (!commonts.isEmpty(dataInfo?.id)) {
        doDetail();
    }
}

function initDataDetail() {
    console.log(popupFlag.value, stores.common.detailInfo);
    if (popupFlag.value) {
        // popup 처리시 stores.common.detailInfo에 인자가 있으면(데이터가 있으면) 값을 업데이트 하고 stores.common.detailInfo 는 초기화함
        if (Object.keys(stores.common.detailInfo).length > 0) {
            Object.assign(dataInfo, stores.common.detailInfo);
            commonts.setInitDetailInfo(stores);
            dataFlag.value = !commonts.isEmpty(dataInfo?.id);
            nextProcess();
        }
    }
}
onBeforeMount(() => {
    // gProp?.axios.all([commonts.getCmCds(gProp, ['CMM001', 'CMM901', 'CMM906'], '')]).then(
    //     gProp?.axios.spread((cmmList: { [x: string]: Array<{ [x: string]: any }> }) => {
    //         Object.keys(cmmList).forEach((key: string) => (commonCode[key.toLowerCase()] = cmmList[key]))
    //         nextProcess()
    //     })
    // )
    let grpCds = ['CMM001', 'CMM901', 'CMM904'];
    const channel = 'mng_code_lists';
    window.ipcRenderer.send(channel, {
        grp_cd: grpCds.join(','),
        use_yn: 'Y',
        sort: 'sort_order asc'
    });
    // list 화면에 popup으로 detail이 들어가는 경우 코드 리스트 조회 ipc 세팅시 detail 쪽은 once 대신 on 으로 세팅한다
    window.ipcRenderer.on([channel, 'return'].join('_'), (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[key.toLowerCase()] = ret[key]));
        nextProcess();
    });
});

onMounted(() => {
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});
</script>
