<template>
    <MoleInput class="px-3 h-12" :label-class-text="labelClassText" :class-text="classText" :label-text="label"
        v-model="textData" @update:model-value="onUpdatedInput" />
</template>

<script lang="ts">
export default {
    name: 'InputTypeModel',
    type: 'TypeModel'
}
</script>

<script setup lang="ts" generic="T extends BaseOptionProps">
import MoleInput from '@m/InputWithLabel.vue';
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

const labelClassText = 'text-black w-full text-base';
const classText = 'text-black w-full text-base';

const textData = ref<string>('');

onMounted(() => {
    // 수정인 경우
    if (props.modelValue.id) {
        textData.value = props.modelValue.value;
    } else {
        // 신규인 경우
        props.modelValue.type_cd = props.typeCd;
    }
});

//#region functions

function onUpdatedInput() {
    props.modelValue.value = textData.value as string;
}

//#endregion
</script>
