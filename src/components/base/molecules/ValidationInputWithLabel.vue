<template>
    <div class="input__wrapper">
        <div :class="`input__label ${labelClassText} ${required && 'required'}`">
            <span>{{ label }}</span>
        </div>

        <div class="input">
            <ValidationInput
                v-model="model"
                :validate-func="validateFunc"
                :error-msg="errorMsg"
                :error-msg-func="errorMsgFunc"
                :placeholder="placeholder"
                :enter-callback="enterCallback"
                :validation-result="validationResult"
                :input-type="inputType"
                :required="required"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
type FlexType = 'row' | 'column';
type ValidateFuncType = (data: string) => boolean | ((data: number) => boolean);
type ErrorMsgFuncType = (data: string | number) => string;

import { PropType } from 'vue';
import ValidationInput from '../atoms/ValidationInput.vue';

const model = defineModel<string | number>();

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    labelClassText: {
        type: String,
        default: 'text-black w-full text-base font-medium'
    },
    validateFunc: {
        type: Function as PropType<ValidateFuncType>
    },
    errorMsg: {
        type: String
    },
    errorMsgFunc: {
        type: Function as PropType<ErrorMsgFuncType>
    },
    placeholder: {
        type: String,
        default: undefined
    },
    enterCallback: {
        type: Function
    },
    validationResult: {
        type: Boolean,
        default: false
    },
    gap: {
        type: String,
        default: '0'
    },
    labelFlexBasis: {
        type: String,
        default: '33.3333%'
    },
    inputFlexBasis: {
        type: String,
        default: '66.6667%'
    },
    inputType: {
        type: String as PropType<'text' | 'number'>,
        default: 'text'
    },
    /**
     * Still in working
     */
    direction: {
        type: String as PropType<FlexType>,
        default: 'row'
    },
    required: {
        type: Boolean,
        default: false
    }
});
</script>

<style lang="scss" scoped>
.input__wrapper {
    display: flex;
    // flex-direction: v-bind('direction');
    align-items: center;
    gap: v-bind('gap');
    .input__label {
        margin-left: 0.5rem;
        padding-right: 0.5rem;
        flex-basis: v-bind('labelFlexBasis');

        &.required {
            position: relative;
            &::after {
                color: red;
                position: absolute;
                content: '*';
                top: 0;
            }
        }
    }

    .input {
        flex-basis: v-bind('inputFlexBasis');
        margin-right: 0.5rem;
    }
}
</style>
