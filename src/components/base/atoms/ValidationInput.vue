<template>
    <div>
        <input
            :type="inputType"
            v-model="model"
            @input="validateInput"
            :placeholder="placeholder ?? t('msg.info.input.default')"
            @keyup.enter="onEnter"
            :onkeydown="(event: KeyboardEvent) => inputType === 'text' || event.key !== 'e'"
            :class="`${required ? 'required' : ''}`"
        />
        <p class="error__msg" ref="errorMsgRef"></p>
    </div>
</template>

<script setup lang="ts">
type ValidateFuncType = (data: string) => boolean | ((data: number) => boolean);
type ErrorMsgFuncType = (data: string | number) => string;

import { base } from '@/plugins/ts/base';
import { PropType, Ref, ref } from 'vue';

const { stores, emitter, gProp, commonts, router, t } = base();
const errorMsgRef: Ref<HTMLParagraphElement | null> = ref(null);
const model = defineModel<string | number>();
const props = defineProps({
    /**
     * validation 함수
     */
    validateFunc: {
        type: Function as PropType<ValidateFuncType>
        // required: true
    },
    /**
     * validation fail시 출력하는 errorMsg
     */
    errorMsg: {
        type: String
    },
    /**
     * validation fail시 errorMsg를 추출 할 함수
     */
    errorMsgFunc: {
        type: Function as PropType<ErrorMsgFuncType>
    },
    /**
     * input placeholder
     */
    placeholder: {
        type: String,
        default: undefined
    },
    /**
     * enter키를 입력했을 때 실행 할 함수
     */
    enterCallback: {
        type: Function
    },
    inputType: {
        type: String as PropType<'text' | 'number'>,
        default: 'text'
    },
    /**
     * 개발 전
     */
    validationResult: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    }
});

function validateInput() {
    const modelValue = model.value;
    const targetValue = modelValue?.toString();
    // debugger;
    //Empty && required 체크
    if (targetValue?.length === 0) {
        //비어 있는 경우
        if (errorMsgRef.value) {
            if (props.required) {
                errorMsgRef.value.innerHTML = t('msg.error.no_input.default');
            } else {
                errorMsgRef.value.innerHTML = '';
            }
        }
    } else {
        //입력된 값이 있다면.
        if (props.validateFunc && targetValue) {
            const validateResult = props.validateFunc(targetValue);
            if (errorMsgRef.value) {
                if (!validateResult) {
                    if (typeof props.errorMsg === 'string') {
                        errorMsgRef.value.innerHTML = props.errorMsg;
                    } else {
                        errorMsgRef.value.innerHTML = props.errorMsgFunc
                            ? props.errorMsgFunc(targetValue)
                            : t('msg.error.invalid.format.default');
                    }
                } else {
                    errorMsgRef.value.innerHTML = '';
                }
            }
        } else {
            //별도의 validationFunc 없다면
            errorMsgRef.value && (errorMsgRef.value.innerHTML = '');
        }
    }
}

function onEnter() {
    props.enterCallback && props.enterCallback();
}

function validate(): boolean {
    if (errorMsgRef.value) {
        return errorMsgRef.value.innerHTML === '';
    }
    return false;
}

defineExpose({
    validate
});
</script>

<style lang="scss" scoped>
.error__msg {
    content: ('*');
    color: red;
}

input {
    outline: none;
    width: 100%;
    border: solid 1px var(--input-border) !important;
    font-size: 1rem;
    background-color: unset;
    border-radius: 0.25rem;
    // text-align: right;

    &.error {
        border-color: red !important;
        border-width: 2px !important;
    }

    &:focus {
        outline: none;
    }

    &:focus:not(:read-only) {
        outline-width: 2px;
        outline-style: solid;
        outline-offset: -2px;
        outline-color: transparent;
        --tw-ring-shadow: none !important;
    }
}
</style>
