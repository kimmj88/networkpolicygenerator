<template>
    <div class="molecule with-label inline-flex items-center justify-around w-full">
        <AtomLabel class="basis-1/3 pr-2 ml-2" :class-text="labelClassText" :label-text="labelText" />
        <div class="basis-2/3 inlien-flex flex-col justify-center items-center flex-grow">
            <AtomInput
                ref="inputRef"
                class="mr-2"
                :id="id"
                :name="id"
                :class-text="classText"
                :model-value="modelValue"
                @update:modelValue="updateValue"
                @keyup.enter="pressEnter"
                @keydown.tab="pressTab"
                @focus="focusHandler"
                :input-type="inputType"
                :placeholder="placeholder"
                :tabindex="tabindex"
                :readonly="readonly"
                :min="min"
                :max="max"
                :maxlength="maxlength"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
// import
import { base } from '@/plugins/ts/base';
import type { IInput } from '@/types/types';
import AtomInput from '@a/Input.vue';
import AtomLabel from '@a/Label.vue';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, toRefs } from 'vue';

const inputRef = ref<IInput | null>(null);

// props
const props = defineProps({
    id: {
        type: String,
        default: undefined
    },
    classText: {
        type: String,
        default: 'text-white w-full text-xl'
    },
    labelClassText: {
        type: String,
        default: 'text-white w-full text-xl'
    },
    labelText: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number],
        default: ''
    },
    inputType: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: base().t('msg.info.input.default')
    },
    tabindex: {
        type: Number,
        default: 0
    },
    readonly: {
        type: Boolean,
        default: false
    },
    min: {
        type: Number,
        default: undefined
    },
    max: {
        type: Number,
        default: undefined
    },
    trueValue: {
        type: [String, Number, Boolean],
        default: true
    },
    falseValue: {
        type: [String, Number, Boolean],
        default: false
    },
    maxlength: {
        type: Number,
        default: undefined
    }
});

// props to variable
const { classText, labelText, modelValue, inputType, placeholder, tabindex } = toRefs(props);
const { gProp, commonts } = base();

const id = computed(() => props.id ?? uuidv4());

// library

// function
const emit = defineEmits(['update:modelValue', 'keyup.enter', 'keydown.tab', 'focus']);

function updateValue(value: any) {
    emit('update:modelValue', value);
}

function pressEnter() {
    commonts.debugLog(gProp, 'pressEnter');
    emit('keyup.enter');
}
function pressTab() {
    commonts.debugLog(gProp, 'pressTab');
    emit('keydown.tab');
}
function focusHandler() {
    emit('focus');
}

defineExpose<IInput>({
    focusInputRef() {
        inputRef.value?.focusInputRef();
    }
});
</script>
