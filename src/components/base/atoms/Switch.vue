<template>
    <div class="atom flex items-center">
        <input
            :id="id"
            type="checkbox"
            :value="modelValue"
            :checked="getProcessedValue(modelValue)"
            @input="updateValue"
            :disabled="disabled"
            :tabindex="tabindex"
        />
        <AtomLabel
            :id="id"
            class="ml-2 font-normal"
            :class-text="labelClassText"
            :label-text="getProcessedValue(modelValue) ? ableText : disableText"
        />
    </div>
</template>

<script setup lang="ts">
interface SwitchProps {
    id?: string;
    modelValue: boolean | string;
    color?: string;
    labelClassText?: string;
    ableText?: string;
    disableText?: string;
    tabindex?: number;
    disabled?: boolean;
}

import AtomLabel from '@a/Label.vue';
import { v4 as uuidv4 } from 'uuid';
import { computed } from 'vue';

const props = withDefaults(defineProps<SwitchProps>(), {
    ableText: '적용',
    disableText: '미적용'
});

const id = computed(() => props.id ?? uuidv4());
const customColor = props.color ? props.color : 'rgb(37 99 235)';
const emit = defineEmits(['update:modelValue']);
const updateValue = (e: Event) => {
    let result: boolean | string = (e.target as HTMLInputElement).checked;
    if (typeof props.modelValue === 'string') {
        if (result) {
            result = 'Y';
        } else {
            result = 'N';
        }
    }
    emit('update:modelValue', result);
};

function getProcessedValue(value: any): boolean {
    if (typeof value === 'string') {
        if (value === 'Y') {
            return true;
        } else {
            return false;
        }
    } else {
        return value;
    }
}
</script>

<style lang="scss" scoped>
label {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}
input[type='checkbox'] {
    --input-width: 3rem;
    --circle-margin: 0.2rem;
    --circle-size: 1.25rem;
    // tailwnd default css 없애기
    background-image: none;
    box-shadow: none;
    outline: none;
    :focus {
        outline: none;
    }

    &:disabled {
        cursor: not-allowed;
    }

    cursor: pointer;
    appearance: none;
    position: relative;
    background-color: rgb(229 231 235 / 1);
    border-radius: 100em;
    border-color: transparent;
    width: var(--input-width);
    height: 1.5rem;
    transition-property: all;
    transition-duration: 250ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
        content: '';
        position: absolute;
        left: var(--circle-margin);
        top: 50%;
        transform: translateY(-50%);
        width: var(--circle-size);
        height: var(--circle-size);
        border-radius: 50%;
        background-color: white;
        transition-property: all;
        transition-duration: 250ms;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:checked {
        background-color: v-bind(customColor);
        &::before {
            left: calc(100% - var(--circle-size) - var(--circle-margin));
        }
    }
}
</style>
