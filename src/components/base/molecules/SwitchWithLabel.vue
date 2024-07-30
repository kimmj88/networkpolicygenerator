<template>
    <div class="molecule with-label inline-flex items-center justify-around w-full">
        <AtomLabel
            class="basis-1/3 pr-2 ml-2"
            :id="id"
            :class-text="labelClassText"
            :label-text="labelText"
        ></AtomLabel>
        <AtomSwitch
            class="basis-2/3 mr-2 h-10"
            :id="id"
            :name="id"
            :model-value="modelValue"
            @update:modelValue="updateValue"
            :color="color"
            :label-class-text="labelClassText"
            :able-text="ableText"
            :disable-text="disableText"
            :tabindex="tabindex"
            :disabled="disabled"
        />
    </div>
</template>

<script setup lang="ts">
interface SwitchLabelProps {
    //label
    id?: string;
    labelClassText?: string;
    labelText: string;
    //switch
    modelValue: boolean | string;
    color?: string;
    ableText?: string;
    disableText?: string;
    tabindex?: number;
    disabled?: boolean;
}

import AtomLabel from '@a/Label.vue';
import AtomSwitch from '@a/Switch.vue';
import { v4 as uuidv4 } from 'uuid';
import { computed } from 'vue';

const props = defineProps<SwitchLabelProps>();

const id = computed(() => props.id ?? uuidv4());
const emit = defineEmits(['update:modelValue']);
const updateValue = (value: any) => {
    emit('update:modelValue', value);
};
</script>
