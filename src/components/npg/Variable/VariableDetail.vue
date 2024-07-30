<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div :class="cardClass" class="mb-3">
                    <CommanderVariableDetail :popup-flag="popupFlag" @click:save="onClickedSave" :is-new="!dataFlag"
                        @click:delete="onClickedDelete" />
                </div>
                <div :class="cardClass" class="mb-3 py-4">
                    <MoleSelect class="px-3 h-12" :class-text="'required select single'"
                        :label-class-text="labelClassText" :label-text="t('voca.variable.type.default')"
                        :place-holder="t('msg.info.select.default')" :options="commonCode?.cmm100"
                        :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                        :reduce="(option: any) => option?.cd" :tabindex="tabIdx.detIn + 1" v-model="dataInfo.type_cd"
                        :clearAable="true" />
                    <MoleInput class="px-3 h-12" :class-text="classText + ' required text'"
                        :label-class-text="labelClassText" :label-text="t('voca.variable.key.default')"
                        :tabindex="tabIdx.detIn + 2" v-model="dataInfo.key" :clearAable="true" />
                    <MoleInput class="px-3 h-12" :class-text="classText + ' required text'"
                        :label-class-text="labelClassText" :label-text="t('voca.variable.value.default')"
                        :tabindex="tabIdx.detIn + 3" v-model="dataInfo.value" :clearAable="true" />
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
import TemplateBase from '@o/TemplateBase.vue';
import { onBeforeMount, onMounted, onUpdated, reactive, ref, watch } from 'vue';
import CommanderVariableDetail from '@/components/npg/Variable/include/CommanderVariableDetail.vue';

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

const { stores, emitter, gProp, commonts, router, t } = base();
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();
const { tabIdx, commonCode, setEmptyMsg, setCodeMsg } = commonVar();

const docName = 'VariableDetail';

const popupFlag = ref(props.popupFlag);
const dataFlag = ref<boolean>(false);

const dataInfo = reactive<{
    id: string;
    type: string;
    type_cd?: string;
    key: string;
    keys: { key_group_id: string; group_name: string }[];
    value: string;
}>({
    id: '',
    type: '',
    type_cd: '',
    key: '',
    value: ''
} as any);

const emit = defineEmits(['close']);

watch(
    () => props.detailInfo,
    () => {
        if (props.detailInfo && props.detailInfo.id != undefined && props.detailInfo.id != '') {
            // update
            dataInfo.id = props.detailInfo.id;
            dataInfo.type_cd = props.detailInfo.type_cd;
            dataInfo.key = props.detailInfo.key;
            dataInfo.value = props.detailInfo.value;
        } else {
            // new
            initModel();
        }

        dataFlag.value = !(props.detailInfo?.value?.id === undefined || props.detailInfo?.value?.id === '');
    }
);

function initModel() {
    dataInfo.id = '';
    dataInfo.key = '';
    dataInfo.keys = [];
    dataInfo.type = '';
    dataInfo.type_cd = '';
    dataInfo.value = '';
}

function onClickedSave() {
    if (dataInfo.type_cd == '' || dataInfo.key == '' || dataInfo.value == '') {
        gProp?.$commonts.notificationShow(gProp, 'error', t('msg.error.no_input.default'));
        return;
    }
    if (!commonts.validator(gProp, docName)) {
        return;
    }
    save();
}

function goList() {
    if (props.popupCloseFunc !== undefined) {
        props.popupCloseFunc(1);
    }
    emit('close');
}

function save(func?: Function) {
    isAxiosFlag.value = true;

    let url = dataFlag.value
        ? commonts.getUrl(gProp, '/variable/update')
        : commonts.getUrl(gProp, '/variable/insert');
    gProp?.axios
        .post(url, dataInfo, getAxiosOptions('DATA', {}))
        .then(function (response: any) {
            isAxiosFlag.value = false;
            commonts.notificationShow(gProp, 'success', t('msg.info.save.default'));
            if (func !== undefined && typeof func === 'function') {
                console.log(func);
                func(response.data);
            } else {
                goList();
            }
        })
        .catch(getErrorFunc)
        .finally(getFinallyFunc);
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
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/variable/delete'), dataInfo, getAxiosOptions('DATA', {}))
            .then(function () {
                isAxiosFlag.value = false;
                commonts.notificationShow(gProp, 'success', t('msg.info.delete.default'));
                goList();
            })
            .catch(function (error: any) {
                commonts.notificationShow(gProp, 'error', t('msg.error.delete.default'));
                return false;
            })
            .finally(getFinallyFunc);
    }
}

function initDataDetail() {
    if (popupFlag.value) {
        // popup 처리시 stores.common.detailInfo에 인자가 있으면(데이터가 있으면) 값을 업데이트 하고 stores.common.detailInfo 는 초기화함
        if (Object.keys(stores.common.detailInfo).length > 0) {
            Object.assign(dataInfo, stores.common.detailInfo);
            dataFlag.value = !(dataInfo?.id === undefined || dataInfo?.id === '');
            commonts.setInitDetailInfo(stores);
        }
    }
}

onBeforeMount(() => {
    let cmGrpCd = ['CMM100'];
    window.ipcRenderer.send('mng_code_lists', {
        grp_cd: cmGrpCd.join(','),
        use_yn: 'Y',
        sort: 'sort_order asc'
    });
    window.ipcRenderer.once('mng_code_lists_return', (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[key.toLowerCase()] = ret[key]));
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
