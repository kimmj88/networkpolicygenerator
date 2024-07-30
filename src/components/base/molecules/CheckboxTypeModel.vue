<template>
    <div class="molecule with-label inline-flex items-center justify-around w-full px-3 h-12">
        <!-- title area -->
        <AtomLabel class="basis-1/3 pr-2 ml-2" :class-text="labelClassText" :label-text="label" />
        <!-- ctrl area -->
        <div class="basis-2/3 pr-2 inlien-flex flex-col justify-center flex-grow flex py-1">
            <!-- listbox -->
            <div class="checkbox_container grid grid-flow-col">
                <div v-for="(item, idx) in options" class="checkbox_item flex-row flex">
                    <AtomInput :input-type="'checkbox'" class="basis-[7%] row-item flex justify-center"
                        v-model="checkDatas[item.cd_nm]" :true-value="true" :false-value="false" />
                    <AtomLabel :class-text="labelClassText" :label-text="item.cd_nm" class="text-center pl-1" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'CheckboxTypeModel',
    type: 'TypeModel'
}
</script>

<script setup lang="ts" generic="T extends BaseOptionProps">
import { labelClassText } from '@/plugins/ts/classText';
import { commonCodeType } from '@/types/types';
import AtomInput from '@a/Input.vue';
import AtomLabel from '@a/Label.vue';
import { onMounted, ref, watch } from 'vue';

export type BaseOptionProps = {
    id: string;
    type_cd: string;
    value: string;
}

interface CheckData {
    [key: string]: boolean;
}

const props = defineProps<{
    commonCode: any;
    typeCd: string;
    modelValue: T;
    label: string;
    optionCode: string;
}>();

const options = ref<commonCodeType[]>([]);

const checkDatas = ref<CheckData>({});

onMounted(() => {
    // 신규인 경우
    if (!props.modelValue.id) {
        props.modelValue.type_cd = props.typeCd;
    }

    if (props.optionCode) {
        const optionCode = props.optionCode.toLowerCase();
        if (props.commonCode[optionCode]) {
            options.value = props.commonCode[optionCode];
        }
    }
});

watch(
    () => options,
    () => {
        const selectedValues = props.modelValue.value.split(',');
        // type 변경시 model value 초기화
        options.value.forEach((option) => {
            checkDatas.value[option.cd_nm] = selectedValues?.includes(option.cd_nm) ? true : false;
        });
    },
    { deep: true }
);

watch(
    () => checkDatas,
    () => {
        const checkedItems = [];
        for (const [key, value] of Object.entries(checkDatas.value)) {
            if (value) {
                checkedItems.push(key);
            }
        }
        props.modelValue.value = checkedItems.join(',');
    },
    { deep: true }
);
</script>

<style lang="scss" scoped></style>
