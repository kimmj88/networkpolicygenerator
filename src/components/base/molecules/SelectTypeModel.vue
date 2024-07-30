<template>
    <MoleSelect class="px-3 h-12" :class-text="classText" :label-class-text="labelClassText" :label-text="label"
        :place-holder="t('msg.info.select.default')" :options="selectOptions"
        :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
        :reduce="(option: any) => option?.cd" v-model="selectedData" @update:modelValue="onChangedSelect($event)" />
</template>

<script lang="ts">
export default {
    name: 'SelectTypeModel',
    type: 'TypeModel'
}
</script>

<script setup lang="ts" generic="T extends BaseOptionProps">
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { commonCodeType } from '@/types/types';
import MoleSelect from '@m/SelectWithLabel.vue';
import { onMounted, ref } from 'vue';

export type BaseOptionProps = {
    id: string;
    type_cd: string;
    value: string;
}

const props = defineProps<{
    commonCode: any;
    typeCd: string;
    modelValue: T;
    label: string;
    optionCode: string;
}>();

const { t } = base();

const { setEmptyMsg, setCodeMsg } = commonVar();

const labelClassText = 'text-black w-full text-base';
const classText = 'text-black w-full text-base';

const selectedData = ref<String>('');
const selectOptions = ref<commonCodeType[]>([]);

onMounted(() => {
    // 수정인 경우
    if (props.modelValue.id) {
        selectedData.value = props.modelValue.value;
    } else {
        // 신규인 경우
        props.modelValue.type_cd = props.typeCd;
    }

    if (props.optionCode) {
        const optionCode = props.optionCode.toLowerCase();
        if (props.commonCode[optionCode]) {
            selectOptions.value = props.commonCode[optionCode];
        } else {
            // base true | false
            selectOptions.value = props.commonCode.cmm902;
        }
    }
});

function onChangedSelect(value: string) {
    props.modelValue.value = value as string;
}
</script>
