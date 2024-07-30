<template>
    <div class="molecule with-label inline-flex flex-row items-center justify-around w-full">
        <AtomLabel :id="id" class="basis-1/3 pr-2 ml-2" :class-text="labelClassText" :label-text="labelText" />
        <div class="basis-2/3 inlien-flex flex-col justify-center items-center">
            <AtomTextarea
                class="mr-2"
                :id="id"
                :name="id"
                :textareaClass="textareaClass"
                :model-value="modelValue"
                @update:modelValue="updateValue"
                :place-holder="placeHolder"
                :readonly="readonly"
                :min="min"
                :max="max"
                :rows="rows"
                :tabindex="tabindex"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
interface TextareaLabelProps {
    //label
    id?: string;
    labelText: string;
    labelClassText?: string;
    //textarea
    modelValue?: any;
    placeHolder?: string;
    textareaClass?: string;
    readonly?: boolean;
    min?: number;
    max?: number;
    rows?: number;
    tabindex?: number;
}

import AtomLabel from '@a/Label.vue';
import AtomTextarea from '@a/Textarea.vue';

defineProps<TextareaLabelProps>();
const emit = defineEmits(['update:modelValue']);
function updateValue(value: any) {
    emit('update:modelValue', value);
}
</script>
