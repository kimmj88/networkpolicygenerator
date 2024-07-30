<template>
    <div class="molecule with-label inline-flex items-center justify-around w-full px-3 flex-col flex">
        <div class="w-full flex-row flex items-center">
            <AtomLabel class="basis-1/3 pr-2 ml-2" :class-text="labelClassText" :label-text="label" />
            <div class="basis-2/3 pr-2 inlien-flex flex-row justify-center items-center flex-grow flex">
                <ValidationInput ref="inputRef" class="flex-auto mr-2" :class-text="classText" v-model="inputText"
                    :validate-func="onValidateInput" @keydown="onKeyDown" @keypress="onKeyPress('IP', $event)" />

                <ValidationInput ref="inputMacRef" class="flex-auto mr-2" :class-text="classText" v-model="inputMacText"
                    :validate-func="onValidateInputMac" @keydown="onKeyDown" />

                <AtomButton :button-name="t('btn.add.default')" :class="btnClass"
                    :class-text="'w-full h-full text-base rounded-md py-2.5 focus:outline-none hover:brightness-75 px-4'"
                    @click="onClickedButton()" />
            </div>
        </div>

        <div class="w-full flex-row flex">
            <!-- title area -->
            <div class="basis-1/3 pr-2 ml-2"></div>
            <!-- ctrl area -->
            <div class="basis-2/3 pr-2 inlien-flex flex-col justify-center items-center flex-grow flex py-1">
                <!-- listbox -->
                <div class="list_container h-24">
                    <div v-for="(item, idx) in dataList" class="list_item flex-row flex">
                        <div class="list_item_left basis-9/10 w-full">
                            {{ item }}
                        </div>
                        <div class="list_item_right basis-1/10" @click="onClickedListItemRight($event, item, idx)">
                            <i class="init-btn bx bx-x w-full"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'ListHostTypeModel',
    type: 'TypeModel'
}
</script>

<script setup lang="ts" generic="T extends BaseOptionProps">
import { base } from '@/plugins/ts/base';
import { IPRegexWithCIDR, macRegex } from '@/plugins/ts/regex';
import AtomButton from '@a/Button.vue';
import AtomLabel from '@a/Label.vue';
import ValidationInput from '@a/ValidationInput.vue';
import { onMounted, ref, watch } from 'vue';

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

const { t } = base();

const labelClassText = 'text-black w-full text-base';
const classText = 'text-black w-full text-base';
const btnClass = 'min-w-[7rem] min-h-[2.5rem]';

const inputRef = ref<any>(null);
const inputMacRef = ref<any>(null);

const inputText = ref<string | number | boolean>('');
const inputMacText = ref<string | number | boolean>('');

const dataList = ref<(string | number | boolean)[]>([]);

onMounted(() => {
    // 신규인 경우
    if (!props.modelValue.id) {
        props.modelValue.type_cd = props.typeCd;
        props.modelValue.value = '';
    }

    if (props.modelValue.value?.length > 0) {
        dataList.value = props.modelValue.value.split(',');
    }
});

watch(
    () => dataList.value,
    () => {
        props.modelValue.value = dataList.value.join(',');
    },
    { deep: true }
);

function onKeyDown(event: KeyboardEvent) {
    if (event.key != 'Enter') {
        return;
    }
    onClickedButton();
}

// Check preesed key is allow.
function onKeyPress(type: string, event: KeyboardEvent) {
    let keysAllowed: string[] = [];

    keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ':', '/'];

    const keyPressed: string = event.key;

    if (!keysAllowed.includes(keyPressed)) {
        event.preventDefault();
    }
}

function onValidateInput(data: string) {
    return IPRegexWithCIDR.test(data);
}

function onValidateInputMac(data: string) {
    return macRegex.test(data);
}

function onClickedButton() {
    if (!inputRef?.value?.validate()) {
        return;
    }
    if (!inputMacRef?.value?.validate()) {
        return;
    }

    const text = inputText.value + ' ' + inputMacText.value;

    if (!validate(text)) {
        return;
    }
    dataList.value.push(text);
    inputText.value = '';
    inputMacText.value = '';
}

function validate(text: string) {
    if (inputText.value == '') {
        return false;
    }
    if (inputMacText.value == '') {
        return false;
    }

    return (
        dataList.value.find((item) => {
            return item == text;
        }) == undefined
    );
}

function onClickedListItemRight(event: MouseEvent, value: string | number | boolean, idx: number) {
    dataList.value = dataList.value.filter((item) => {
        return item != value;
    });
}
</script>

<style lang="scss" scoped>
div.list_container {
    width: 100%;
    border-radius: 4px;

    border: solid 1px var(--input-border);

    overflow: auto;
}

div.list_item {
    padding-top: 4px;
    padding-left: 4px;
}

div.list_item:hover {
    color: white;
    background-color: var(--vs-dropdown-option--active-bg);
}

div.list_item_left {
    padding-left: 6px;
}

div.list_item_right {
    padding-right: 4px;
}
</style>
