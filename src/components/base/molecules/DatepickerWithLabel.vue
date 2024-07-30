<template>
    <div class="molecule with-label inline-flex flex-row items-center justify-around w-full">
        <AtomLabel
            class="basis-1/3 pr-2 ml-2"
            :id="id"
            :class-text="labelClassText"
            :label-text="labelText"
        ></AtomLabel>
        <AtomDatepicker
            class="basis-2/3 mr-2"
            :id="id"
            :name="id"
            :class-text="classText"
            :model-value="modelValue"
            :data-type="dataType"
            @input:date="updateValue"
            :tabindex="tabindex"
        ></AtomDatepicker>
    </div>
</template>

<script setup lang="ts">
// import
import { base } from '@/plugins/ts/base';
import AtomDatepicker from '@a/Datepicker.vue';
import AtomLabel from '@a/Label.vue';
import { v4 as uuidv4 } from 'uuid';
import { computed, toRefs } from 'vue';

// props
const props = defineProps({
    id: {
        type: String,
        default: undefined
    },
    classText: {
        type: String,
        default: 'text-white w-full h-12 text-base'
    },
    labelClassText: {
        type: String,
        default: 'text-white w-full h-12 text-base'
    },
    labelText: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: undefined
    },
    modelValue: {
        type: [String, Array],
        default: ''
    },
    dataType: {
        type: Array<string>,
        default: undefined
    },
    placeholder: {
        type: String,
        default: base().t('msg.info.input.default')
    },
    tabindex: {
        type: Number,
        default: 0
    }
});

// props to variable
const { classText, labelText, modelValue, dataType } = toRefs(props);

const id = computed(() => props.id ?? uuidv4());

// library
const { commonts, gProp } = base();

// function
const emit = defineEmits(['update:modelValue']);

const updateValue = (value: any) => {
    commonts.debugLog(gProp, ['datepicker ==============>' + value]);
    emit('update:modelValue', value);
};
</script>
