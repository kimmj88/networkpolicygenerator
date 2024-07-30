<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:body>
                <div :class="cardClass" class="mb-3">
                    <CommanderModuleDetail @click:save.once="onClickedSave" :is-new="isNew"
                        @click:delete="onClickedDelete" :key="saveKey" />
                </div>
                <div :class="cardClass" class="mb-3 py-4">
                    <MoleInput class="px-3 h-12" :class-text="classText + ' required text'"
                        :label-class-text="labelClassText" :label-text="t('voca.title.default')"
                        v-model="moduleData.title" />
                </div>
                <div :class="cardClass" class="mt-2 py-4">
                    <MoleSelect class="px-3 h-12" :class-text="'required select single'"
                        :label-class-text="labelClassText" :label-text="t('voca.type.default')"
                        :place-holder="t('msg.info.select.default')" :options="commonCode.cmm300"
                        :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                        :reduce="(option: any) => option?.cd_nm" v-model="moduleData.type_cd"
                        @update:model-value="onUpdatedModuleType" :disabled="!isNew" />

                    <div class="min-h-[30rem]">
                        <TypeOptionDetail :options="optionItems" :common-code="commonCode" :module-id="detailInfo?.id"
                            :module-data="detailInfo" v-model="moduleValueData" :module-type="moduleData.type_cd" />
                    </div>
                </div>
            </template>
        </TemplateBase>
    </div>
</template>

<script setup lang="ts">
import CommanderModuleDetail from '@/components/npg/module/include/CommanderModuleDetail.vue';
import TypeOptionDetail from '@/components/npg/module/include/TypeOptionDetail.vue';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { useCodeStore } from '@/stores/useCodeStore';
import { commonCodeType } from '@/types/types';
import { requestManager } from '@cm/types/domain/apis/common';
import { ReqCreateModule, ReqDeleteModule } from '@cm/types/domain/apis/module/module';
import { ModuleDTO } from '@cm/types/domain/dto/module/moduleDTO';
import { ModuleValueDTO } from '@cm/types/domain/dto/module/moduleValueDTO';
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import TemplateBase from '@o/TemplateBase.vue';
import { PropType, onBeforeMount, onMounted, ref } from 'vue';

interface OptionData {
    [key: string]: ModuleValueDTO;
}

const docName = 'ModuleDetail';

const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';
const labelClassText = 'text-black w-full text-base';
const classText = 'text-black w-full text-base';

const props = defineProps({
    detailInfo: {
        type: Object as PropType<ModuleDTO>,
        default: {} as any
    }
});

//#region properties
const { emitter, gProp, commonts, t } = base();
const { commonCode, setEmptyMsg, setCodeMsg } = commonVar();
const codeStore = useCodeStore();

const emit = defineEmits(['close']);
const moduleData = ref<ModuleDTO>({
    id: 0,
    type_cd: '',
    title: '',
    module_value_list: []
});
const moduleValueData = ref<OptionData>({});
const isNew = ref<boolean>(true);
const optionItems = ref<commonCodeType[]>([]);
const saveKey = ref<number>(0);

//#region events

onBeforeMount(() => {
    codeStore.get({
        codeKeys: ['CMM300', 'CMM902', 'CMM301', 'CMM302', 'CMM303', 'CMM304', 'CMM305', 'CMM306',
            'CMM307', 'CMM308', 'CMM350', 'CMM351', 'CMM352', 'CMM353', 'CMM354', 'CMM355', 'CMM356', 'CMM357', 'CMM358', 'CMM359'
        ]
    }).then((res) => {
        Object.keys(res).forEach((key: string) => (commonCode[key.toLowerCase()] = res[key]));
        init();
    });
});

onMounted(() => {
    commonts.initPage({ docNameId: docName });
});

//#endregion

//#region function

function init() {
    moduleData.value = {
        id: props.detailInfo?.id ? props.detailInfo?.id : 0,
        type_cd: props.detailInfo?.type_cd ? props.detailInfo?.type_cd : '',
        title: props.detailInfo?.title ? props.detailInfo?.title : '',
        module_value_list: props.detailInfo?.module_value_list ? props.detailInfo?.module_value_list : []
    };

    if (moduleData.value?.id != undefined && moduleData.value.id != 0) {
        isNew.value = false;
    }

    // if is not select type        
    if (moduleData.value.type_cd != '') {
        moduleTypeChange(true, moduleData.value.type_cd as string);
    }
}

function onUpdatedModuleType(value: string) {
    moduleTypeChange(true, value);
}

function moduleTypeChange(result: boolean, value: string) {
    if (!result) {
        return;
    }
    const type: commonCodeType = commonCode.cmm300.find((item: commonCodeType) => item.cd_nm == value);
    if (type) {
        const selectedType = type.cd.toLowerCase();
        optionItems.value = commonCode[selectedType];
    } else {
        // is not select item.
        optionItems.value = [];
    }
    moduleValueData.value = {};
}

function onClickedSave(func?: Function) {
    if (moduleData.value.type_cd == '' || moduleData.value.title == '') {
        gProp?.$commonts.notificationShow(gProp, 'error', t('msg.error.no_input.default'));
        saveKey.value++;
        return;
    }
    //data validation
    if (!commonts.validator(gProp, docName)) {
        saveKey.value++;
        return;
    }

    let url = !isNew.value ? commonts.getUrl(gProp, '/module/update') : commonts.getUrl(gProp, '/module/insert');

    const moduleValues: ModuleValueDTO[] = [];
    Object.values(moduleValueData.value).forEach((item) => {
        if (item.value != '' && item.value != null) {
            if (!item.module_id && moduleData.value.id != 0) {
                item.module_id = moduleData.value.id;
            }
            moduleValues.push(item);
        }
    });

    requestManager.call<ReqCreateModule>(url, {
        data: {
            id: moduleData.value.id ? moduleData.value.id : undefined,
            title: moduleData.value.title,
            type_cd: moduleData.value.type_cd,
            module_value_list: Object.values(moduleValues)
        }
    }).then((res) => {
        commonts.notificationShow(gProp, 'success', t('msg.info.save.default'));
        emit('close');
    }).finally(() => {
        saveKey.value++;
    });
}

function onClickedDelete() {
    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.delete.default'),
        method: 'YN',
        cbFunc: (res: boolean) => {
            if (res) {
                requestDelete();
            }
        }
    });
}

function requestDelete() {
    requestManager.call<ReqDeleteModule>(commonts.getUrl(gProp, '/module/delete'), {
        data: {
            id: props.detailInfo?.id as number
        }
    }).then((res) => {
        commonts.notificationShow(gProp, 'success', t('msg.info.delete.default'));
        emit('close');
    });
}

//#endregion
</script>
