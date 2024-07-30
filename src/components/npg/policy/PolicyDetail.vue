<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div :class="cardClass" class="grid grid-cols-2 grid-rows-1">
                    <div  class="border-2 col-span-2 row-span-2">
                        <CommanderPolicyDetail :popup-flag="popupFlag" @click:save="onClickedSave" :is-new="dataFlag"
                        @click:delete="onClickedDelete" />
                    </div>
                    <div class="border-2 col-span-1 row-span-2">
                        <MoleInput class="px-3 h-12" :class-text="classText + ' required text'"
                        :label-class-text="labelClassText" :label-text="t('voca.policy.title.default')"
                        v-model="dataInfo.title"/>
                        <MoleSelect class="px-3 h-12" :class-text="'text-black w-full h-10 text-base'"
                            :label-class-text="labelClassText" :label-text="t('voca.policy.module_list.snort')"
                            :place-holder="t('msg.info.select.default')" :options="moduleList['SNORT']"
                            :get-option-label="(option: any) => setEmptyMsg(option, option.title)"
                            :reduce="(option: any) => option" v-model="dataInfo.policyModules['SNORT']"
                            @update:model-value="onUpdatedModel" />
                        <MoleSelect class="px-3 h-12" :class-text="'text-black w-full h-10 text-base'"
                            :label-class-text="labelClassText" :label-text="t('voca.policy.module_list.reputation')"
                            :place-holder="t('msg.info.select.default')" :options="moduleList['REPUTATION']"
                            :get-option-label="(option: any) => setEmptyMsg(option, option.title)"
                            :reduce="(option: any) => option" v-model="dataInfo.policyModules['REPUTATION']" 
                            @update:model-value="onUpdatedModel" />
                        <MoleSelect class="px-3 h-12" :class-text="'text-black w-full h-10 text-base'"
                            :label-class-text="labelClassText" :label-text="t('voca.policy.module_list.port_scan')"
                            :place-holder="t('msg.info.select.default')" :options="moduleList['PORT_SCAN']"
                            :get-option-label="(option: any) => setEmptyMsg(option, option.title)"
                            :reduce="(option: any) => option" :tabindex="tabIdx.detIn + 1"
                            v-model="dataInfo.policyModules['PORT_SCAN']" 
                            @update:model-value="onUpdatedModel" />
                        <MoleSelect class="px-3 h-12" :class-text="'text-black w-full h-10 text-base'"
                            :label-class-text="labelClassText" :label-text="t('voca.policy.module_list.ips')"
                            :place-holder="t('msg.info.select.default')" :options="moduleList['IPS']"
                            :get-option-label="(option: any) => setEmptyMsg(option, option.title)"
                            :reduce="(option: any) => option" v-model="dataInfo.policyModules['IPS']"
                            @update:model-value="onUpdatedModel" />
                        <MoleSelect class="px-3 h-12" :class-text="'text-black w-full h-10 text-base'"
                            :label-class-text="labelClassText" :label-text="t('voca.policy.module_list.arp_spoof')"
                            :place-holder="t('msg.info.select.default')" :options="moduleList['ARP_SPOOF']"
                            :get-option-label="(option: any) => setEmptyMsg(option, option.title)"
                            :reduce="(option: any) => option" v-model="dataInfo.policyModules['ARP_SPOOF']"
                            @update:model-value="onUpdatedModel" />
                        <MoleSelect class="px-3 h-12" :class-text="'text-black w-full h-10 text-base'"
                            :label-class-text="labelClassText" :label-text="t('voca.policy.module_list.alert_syslog')"
                            :place-holder="t('msg.info.select.default')" :options="moduleList['ALERT_SYSLOG']"
                            :get-option-label="(option: any) => setEmptyMsg(option, option.title)"
                            :reduce="(option: any) => option" v-model="dataInfo.policyModules['ALERT_SYSLOG']"
                            @update:model-value="onUpdatedModel" />
                        <MoleSelect class="px-3 h-12" :class-text="'text-black w-full h-10 text-base'"
                            :label-class-text="labelClassText" :label-text="t('voca.policy.module_list.alert_unixsock')"
                            :place-holder="t('msg.info.select.default')" :options="moduleList['ALERT_UNIXSOCK']"
                            :get-option-label="(option: any) => setEmptyMsg(option, option.title)"
                            :reduce="(option: any) => option" v-model="dataInfo.policyModules['ALERT_UNIXSOCK']"
                            @update:model-value="onUpdatedModel" />
                        <MoleSelect class="px-3 h-12" :class-text="'text-black w-full h-10 text-base'"
                            :label-class-text="labelClassText" :label-text="t('voca.policy.module_list.alert_full')"
                            :place-holder="t('msg.info.select.default')" :options="moduleList['ALERT_FULL']"
                            :get-option-label="(option: any) => setEmptyMsg(option, option.title)"
                            :reduce="(option: any) => option" v-model="dataInfo.policyModules['ALERT_FULL']"
                            @update:model-value="onUpdatedModel" />
                        <MoleSelect class="px-3 h-12" :class-text="'text-black w-full h-10 text-base'"
                            :label-class-text="labelClassText" :label-text="t('voca.policy.module_list.alert_fast')"
                            :place-holder="t('msg.info.select.default')" :options="moduleList['ALERT_FAST']"
                            :get-option-label="(option: any) => setEmptyMsg(option, option.title)"
                            :reduce="(option: any) => option" v-model="dataInfo.policyModules['ALERT_FAST']"
                            @update:model-value="onUpdatedModel" />
                    </div>
                    <div class="border-2 col-span-1 row-span-2">
                        <AtomTextarea class="" :textareaClass="'border-none outline-none resize-none w-full'"
                        :model-value="parsedMsg" :readonly="true" :rows="30" />
                    </div>
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
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import AtomTextarea from '@a/Textarea.vue';
import TemplateBase from '@o/TemplateBase.vue';
import { onBeforeMount, onMounted, onUpdated, ref, toRefs, watch, type Ref } from 'vue';
import { ModuleDTO, SearchModuleDTO } from '@cm/types/domain/dto/module/moduleDTO';
import { PolicyDTO } from '@cm/types/domain/dto/policy/policyDTO';
import CommanderPolicyDetail from '@/components/npg/policy/include/CommanderPolicyDetail.vue';
import { axiosPost } from '@cm/types/domain/apis/common';

const props = defineProps({
    detailInfo: {
        type: Object,
        default: {} as any
    },
    popupFlag: {
        type: Boolean,
        default: false
    },
    parsedMsg: {
        type: String,
        default: ''
    },
    commonCode: {
        type: Object as any,
        required: true
    },
    popupCloseFunc: Function
});

const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';
const labelClassText = 'text-black w-full text-base';
const classText = 'text-black w-full text-base';

const { stores, emitter, gProp, commonts, t } = base();
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();
const { tabIdx, setEmptyMsg } = commonVar();

const { commonCode } = toRefs(props);

const docName = 'PolicyDetail';

const popupFlag = ref(props.popupFlag);
const parsedMsg = ref(props.parsedMsg);
const dataFlag = ref<boolean>(false);
const moduleList = ref({} as any);

const dataInfo = ref({
    title: '',
    policyModules: {
    }
} as any);

watch(
    
    () => props.detailInfo,
    () => {
        if (props.detailInfo && props.detailInfo.id != undefined) {
            // update

            dataInfo.value.id = props.detailInfo.id;
            dataInfo.value.title = props.detailInfo.title;
            dataInfo.value.policyModules = {
                ...dataInfo.value.policyModules,
                ...props.detailInfo.policyModules
            };
            dataFlag.value = false;
        } else {

            // new
            dataInfo.value.id = '';
            dataInfo.value.title = '';
            dataInfo.value.policyModules = {};

            dataFlag.value = true;
        }
    }
);



const emit = defineEmits(['close']);

function onClickedSave(func?: Function) {
    if (dataInfo.value.title == '') {
        gProp?.$commonts.notificationShow(gProp, 'error', t('msg.error.no_input.default'));
        return;
    }

    const moduleFilterData: any = Object.values(dataInfo.value.policyModules).filter((element: any, i) => {
        if (element != null) {
            return Object.keys(element).length > 0;
        }
        return false;
    });

    const searchDTO: PolicyDTO = { id: dataInfo.value.id, title: dataInfo.value.title, modules: moduleFilterData as ModuleDTO[] };

    let url = !dataFlag.value ? commonts.getUrl(gProp, '/policy/update') : commonts.getUrl(gProp, '/policy/insert');

    if (dataFlag.value != true) {
        axiosPost<PolicyDTO>(url, searchDTO).then((res) => {
            commonts.notificationShow(gProp, 'success', t('msg.info.save.default'));
            emit('close');
        })
    }
    else {
        gProp?.axios
            .post(commonts.getUrl(gProp, '/policy/insert'), searchDTO, getAxiosOptions('DATA', {}))
            .then(function (response: any) {

                isAxiosFlag.value = false;
                commonts.notificationShow(gProp, 'success', t('msg.info.save.default'));

                if (func !== undefined && typeof func === 'function') {
                    func(response.data);
                } else {
                    if (props.popupCloseFunc !== undefined) {
                        props.popupCloseFunc(1);
                    }
                    emit('close');
                }
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

async function onUpdatedModel() {
    parsedMsg.value = '';
    getPreview();
}

function onClickedDelete() {
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
    const deleteDTO: PolicyDTO = { id: dataInfo.value.id, title: dataInfo.value.title };

    gProp?.axios
        .post(commonts.getUrl(gProp, '/policy/delete'), deleteDTO, getAxiosOptions('DATA', {}))
        .then(function () {
            isAxiosFlag.value = false;
            commonts.notificationShow(gProp, 'success', t('msg.info.delete.default'));
            if (props.popupCloseFunc !== undefined) {
                props.popupCloseFunc(1);
            }
            emit('close');
        })
        .catch(function (error: any) {
            commonts.notificationShow(gProp, 'error', t('msg.error.delete.default'));
            return false;
        })
        .finally(getFinallyFunc);
}

function loadPolicyModule() {

    for (const code of commonCode?.value.cmm300) {
        const snortModuleDTO: SearchModuleDTO = {
            type_cd: code.cd_nm
        };
        gProp?.axios
            .post(commonts.getUrl(gProp, '/module/list'), { data: snortModuleDTO }, getAxiosOptions('DATA', {}))
            .then((response: any) => {

                moduleList.value[code.cd_nm] = response?.data.modules;
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function initDataDetail() {
    if (popupFlag.value) {
        // popup 처리시 stores.common.detailInfo에 인자가 있으면(데이터가 있으면) 값을 업데이트 하고 stores.common.detailInfo 는 초기화함
        if (Object.keys(stores.common.detailInfo).length > 0) {
            Object.assign(dataInfo, stores.common.detailInfo);
            commonts.setInitDetailInfo(stores);
        }
    }
}

onBeforeMount(() => {


    parsedMsg.value = '';
});

onMounted(() => {

    parsedMsg.value = '';
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

onUpdated(() => {
    loadPolicyModule();
    getPreview();

    parsedMsg.value = '';
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    commonts.initPage({ docNameId: docName }, undefined, initDataDetail);
});

function getPreview() {
    const previewDTO: PolicyDTO = { modules: Object.values(dataInfo.value.policyModules) }
    gProp?.axios
        .post(
            commonts.getUrl(gProp, '/policy/preview'),
            previewDTO,
            getAxiosOptions('DATA', {})
        )
        .then((response: any) => {
            parsedMsg.value = response?.data.text;
        })
        .catch(getErrorFunc)
        .finally(getFinallyFunc);
}
</script>



<style lang="scss" scoped></style>
