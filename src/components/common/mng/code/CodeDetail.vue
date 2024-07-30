<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div :class="cardClass">
                    <CommanderCodeDetail
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
                    <MoleSelect
                        class="px-3 mb-2"
                        :class-text="'required select single'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.group.code.default')"
                        :options="grpCdList"
                        v-model="dataInfo.grp_cd"
                        :placeholder="$t('msg.info.select.default')"
                        :get-option-label="
                            (option: any) => setEmptyMsg(option, option?.grp_cd + ' - ' + option?.grp_cd_nm)
                        "
                        :reduce="(option: any) => option?.grp_cd"
                        :disabled="dataFlag"
                        :tabindex="tabIdx.detIn + 1"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText + ' required string'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.code.default')"
                        v-model="dataInfo.cd"
                        :readonly="dataFlag"
                        :tabindex="tabIdx.detIn + 2"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText + ' required string'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.code.name.default')"
                        v-model="dataInfo.cd_nm"
                        :tabindex="tabIdx.detIn + 3"
                    />
                    <MultiLanguage :common-code="commonCode" :ml-info="mlInfo" />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText + ' required text'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.code.description.default')"
                        v-model="dataInfo.cd_dc"
                        :tabindex="tabIdx.detIn + 5"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.code.item.1.default')"
                        v-model.lazy.trim="dataInfo.item1"
                        :tabindex="tabIdx.detIn + 6"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.code.item.2.default')"
                        v-model.lazy.trim="dataInfo.item2"
                        :tabindex="tabIdx.detIn + 7"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.code.item.3.default')"
                        v-model.lazy.trim="dataInfo.item3"
                        :tabindex="tabIdx.detIn + 8"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.code.item.4.default')"
                        v-model.lazy.trim="dataInfo.item4"
                        :tabindex="tabIdx.detIn + 9"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.code.item.5.default')"
                        v-model.lazy.trim="dataInfo.item5"
                        :tabindex="tabIdx.detIn + 10"
                    />
                    <MoleInput
                        class="px-3 mb-2"
                        :class-text="classText + ' number'"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.sort.order.default')"
                        v-model.lazy.trim="dataInfo.sort_order"
                        :tabindex="tabIdx.detIn + 11"
                    />
                    <MoleSwitch
                        class="px-3 mb-2"
                        :label-class-text="labelClassText"
                        :label-text="t('voca.use.yn.default')"
                        v-model="dataInfo.use_yn"
                        :able-text="t('voca.use.y.default')"
                        :disable-text="t('voca.use.n.default')"
                        :tabindex="tabIdx.detIn + 12"
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
import CommanderCodeDetail from './include/CommanderCodeDetail.vue';
import MultiLanguage from './include/MultiLanguage.vue';

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
const { svcType, tabIdx, commonCode, multi_language, languages, setEmptyMsg } = commonVar();

const docName = 'CmCodeDetail';

const popupFlag = ref(props.popupFlag);

const id = ref(props.detailInfo?.value?.id === undefined ? '' : props.detailInfo?.value?.id);
const grpCd = ref(props.detailInfo?.value?.grp_cd === undefined ? '' : props.detailInfo?.value?.grp_cd);
const cd = ref(props.detailInfo?.value?.cd === undefined ? '' : props.detailInfo?.value?.cd);

console.log(commonts.isEmpty(props?.detailInfo?.value?.grp_cd) && commonts.isEmpty(props?.detailInfo?.value?.cd));
const dataFlag = ref(!commonts.isEmpty(props.detailInfo?.value?.id));

const dataInfo = reactive({
    svc_type: svcType.value,
    id: id,
    grp_cd: grpCd,
    cd: cd,
    cd_nm: '',
    cd_dc: '',
    sort_order: '',
    use_yn: 'Y',
    ml_info: []
} as any);

const grpCdList = ref([] as any);
const mlInfo = ref([] as any);

const emit = defineEmits(['close']);

function goList() {
    if (!popupFlag.value) {
        router?.replace({ path: '/cmcode/list' });
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
        /**
        // isAxiosFlag.value = true
        // commonts.debugLog(gProp, dataInfo)
        // gProp?.axios
        //     .post(commonts.getUrl(gProp, '/management/code/code/detail'), dataInfo, getAxiosOptions('DATA', {}))
        //     .then(function (response: any) {
        //         dataInfo = response.data
        //         console.log(dataInfo)
        //         setMultiLanguageInfo()
        //     })
        //     .catch(getErrorFunc)
        //     .finally(getFinallyFunc)
         */

        let channel = 'mng_code_detail';
        window.ipcRenderer.send(channel, JSON.parse(JSON.stringify(dataInfo)));
        window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
            Object.assign(dataInfo, ret);
            console.log(ret, dataInfo);
            setMultiLanguageInfo();
        });
    }
}

function setMultiLanguageInfo() {
    commonts.debugLog(gProp, 'setMultiLanguageInfo');
    mlInfo.value = [];
    commonCode?.cmm901?.forEach((data: { [x: string]: any }) => {
        let lang_cd = data.cd;
        let mlData = {} as any;
        let dataColumn = ['grp_cd', 'cd', 'name'];
        dataColumn.forEach((key) => {
            mlData[key] = dataInfo[key] !== undefined ? dataInfo[key] : '';
        });
        mlData['lang_cd'] = lang_cd;
        console.log(dataInfo);
        if (!commonts.isEmpty(dataInfo.ml_info)) {
            // name
            dataInfo.ml_info.some((val: { [x: string]: any }) => {
                if (val.lang_cd === mlData.lang_cd) {
                    mlData['id'] = val.id ?? -1;
                    mlData['name'] = val.name;
                    return true;
                }
            });
        }
        mlInfo.value.push(mlData);
    });
    return mlInfo;
}

function doSave() {
    // data validation
    if (!commonts.validator(gProp, docName)) {
        return false;
    }

    console.log('doSave');

    /**
    // if (!isAxiosFlag.value) {
    //     isAxiosFlag.value = true
    //     let url = dataFlag.value
    //         ? commonts.getUrl(gProp, '/management/code/code/update')
    //         : commonts.getUrl(gProp, '/management/code/code/insert')
    //     // 다국어 메세지 처리 수정부분 적용
    //     dataInfo.ml_info = mlInfo.value
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
    dataInfo.ml_info = mlInfo.value;

    let channel = dataFlag.value ? 'mng_code_update' : 'mng_code_insert';
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
    //         .post(commonts.getUrl(gProp, '/management/code/code/delete'), dataInfo, getAxiosOptions('DATA', {}))
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
    let channel = 'mng_code_delete';
    window.ipcRenderer.send(channel, JSON.parse(JSON.stringify(dataInfo)));
    window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
        commonts.notificationShow(gProp, 'success', t('msg.info.delete.default'));
        /**
        // commonts.notificationShow(gProp, 'error', t('msg.error.delete.default'));
         */
        goList();
    });
}

function getDocListBtnName() {
    return popupFlag.value ? 'btn.close.default' : 'btn.list.default';
}

function nextProcess() {
    if (!commonts.isEmpty(dataInfo?.id)) {
        commonts.debugLog(gProp, 'nextProcess doDetail');
        doDetail();
    }
}

function initDataDetail() {
    if (popupFlag.value) {
        commonts.debugLog(gProp, stores.common.detailInfo, Object.keys(stores.common.detailInfo).length);
        // popup 처리시 stores.common.detailInfo에 인자가 있으면(데이터가 있으면) 값을 업데이트 하고 stores.common.detailInfo 는 초기화함
        if (Object.keys(stores.common.detailInfo).length > 0) {
            Object.assign(dataInfo, stores.common.detailInfo);
            dataFlag.value = !commonts.isEmpty(dataInfo?.id);
            setMultiLanguageInfo();
            commonts.setInitDetailInfo(stores);
            nextProcess();
        }
    }
}

onBeforeMount(() => {
    // gProp?.axios
    // 	.all([commonts.getCmGrpCd(gProp, ""), commonts.getCmCds(gProp, ["CMM001", "CMM901", "CMM904"], "")])
    // 	.then(
    // 		gProp?.axios.spread(
    // 			(grpCdList: Array<{ [x: string]: any }>, cmmList: { [x: string]: Array<{ [x: string]: any }> }) => {
    // 				grpCdList.value = grpCdList;
    // 				Object.keys(cmmList).forEach((key: string) => (commonCode[key.toLowerCase()] = cmmList[key]));
    // 				nextProcess();
    // 			}
    // 		)
    // 	);

    const channelGrpCode = 'mng_grp_code_list';
    window.ipcRenderer.send(channelGrpCode, {});
    window.ipcRenderer.once([channelGrpCode, 'return'].join('_'), (_evt, ret) => {
        grpCdList.value = ret;
    });

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
    });
});

onMounted(() => {
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

onUpdated(() => {
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});
</script>
