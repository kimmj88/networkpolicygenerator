<template>
    <div class="molecule with-label inline-flex items-center justify-around w-full">
        <AtomLabel :id="id" class="basis-1/3 pr-2 ml-2" :class-text="labelClassText" :label-text="labelText" />
        <div class="basis-2/3 inlien-flex flex-col justify-center items-center flex-grow">
            <AtomSelect
                ref="selectRef"
                :id="id"
                :name="id"
                class="mr-2"
                :class-text="classText"
                :options="options"
                :model-value="modelValue"
                :place-holder="placeHolder"
                @update:modelValue="selectHandler"
                @click:option="clickOption"
                :get-option-label="getOptionLabel"
                :reduce="reduce"
                :disabled="disabled"
                :tabindex="tabindex"
                :openDropdownHandler="openDropdownHandler"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
interface SelectLabelProps {
    //label
    id?: string;
    labelClassText?: string;
    labelText: string;
    //select
    options: any;
    modelValue: any;
    placeHolder?: string;
    getOptionLabel?: Function;
    reduce?: Function;
    classText?: string;
    disabled?: boolean;
    tabindex?: number;
    openDropdownHandler?: Function;
}

import type { IInput } from '@/types/types';
import AtomLabel from '@a/Label.vue';
import AtomSelect from '@a/Select.vue';
import { ref } from 'vue';

defineProps<SelectLabelProps>();
const selectRef = ref<IInput | null>(null);
const emit = defineEmits(['update:modelValue', 'click:option']);
const selectHandler = (value: any) => {
    emit('update:modelValue', value ? value : '');
};

const clickOption = (value: any) => {
    emit('click:option', value ? value : '');
};

defineExpose<IInput>({
    focusInputRef() {
        selectRef.value?.focusInputRef();
    }
});
</script>
