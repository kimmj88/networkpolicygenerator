<template>
    <div class="molecule with-label inline-flex items-center justify-around w-full px-3 py-1">
        <div class="w-full flex-row flex items-center">
            <AtomLabel class="basis-1/3 pr-2 ml-2" :class-text="labelClassText" :label-text="label" />
            <div class="basis-2/3 pr-2 inlien-flex flex-row justify-center flex">
                <!-- listbox -->
                <div class="list_container h-28">
                    <div v-for="(item, idx) in dataList" class="list_item flex-row flex items-center">
                        <div class="list_item_left basis-9/10 w-full">
                            {{ item }}
                        </div>
                        <div class="list_item_right basis-1/10" @click="onClickedListItemRight($event, item, idx)">
                            <i class="init-btn bx bx-x w-full h-full"></i>
                        </div>
                    </div>
                </div>

                <div class="pl-2">
                    <AtomButton :button-name="t('btn.add.default')"
                        :class-text="'w-full h-full text-base rounded-md py-2.5 focus:outline-none hover:brightness-75 px-4'"
                        :class="btnClass" @click="onClickedButton()" />
                </div>
            </div>
        </div>
    </div>

    <BasePopup index="210" :id="popupId" :add-class="'max-w-2xl h-fit'" :add-body-class="'p-0'" @close="onClosePopup"
        :is-show="isPopupShow">
        <template v-slot:title>{{ codeData?.item4 ? t(codeData?.item4) : 'Popup' }}</template>
        <template v-slot:msg>
            <component :is="optionComponent()" @close="onClosePopup" :popup-list="popupList" />
        </template>
    </BasePopup>
</template>

<script lang="ts">
export default {
    name: 'ListPopupTypeModel',
    type: 'TypeModel'
}
</script>

<script setup lang="ts" generic="T extends BaseOptionProps">
import BasePopup from '@/components/common/util/popup/BasePopup.vue';
import { base } from '@/plugins/ts/base';
import AtomButton from '@a/Button.vue';
import AtomLabel from '@a/Label.vue';
import { onMounted, ref, watch } from 'vue';
import * as modulePopups from '@/components/npg/module/include/popup';
import { commonCodeType } from '@/types/types';

export type BaseOptionProps = {
    id: string;
    type_cd: string;
    value: string;
}

interface OptionComponent {
    [key: string]: any;
}

const props = defineProps<{
    commonCode: any;
    typeCd: string;
    modelValue: T;
    label: string;
    optionCode: string;
    codeData: commonCodeType;
    moduleType: string;
}>();

const { t, commonts } = base();

const labelClassText = 'text-black w-full text-base';
const btnClass = 'min-w-[7rem] min-h-[2.5rem]';

const dataList = ref<string[]>([]);
const popupModal = ref<any>();
const popupId = 'ListPopupId';
const popupList = ref<any[]>([]);
const isPopupShow = ref<boolean>(false);

const optionComponents: OptionComponent = {};

onMounted(() => {
    popupModal.value = commonts.makeModal(popupId);

    // 신규인 경우
    if (!props.modelValue.id) {
        props.modelValue.type_cd = props.typeCd;
    }

    if (props.modelValue.value?.length > 0) {
        dataList.value = props.modelValue.value.split(',');
    }

    Object.values(modulePopups).forEach((item) => {
        if (item && item.default && item.default.__name) {
            optionComponents[item.default.__name] = item;
        }
    });
});

watch(
    () => dataList,
    () => {
        const checkedItems = [];
        for (const [key, value] of Object.entries(dataList.value)) {
            if (value) {
                checkedItems.push(value);
            }
        }
        props.modelValue.value = checkedItems.join(',');
    },
    { deep: true }
);

function onClickedButton() {
    popupList.value = dataList.value;
    isPopupShow.value = true;
}

function onClickedListItemRight(event: MouseEvent, value: string | number | boolean, idx: number) {
    dataList.value = dataList.value.filter((item) => {
        return item != value;
    });
}

function onClosePopup(value: any) {
    if (value && value.data) {
        props.modelValue.value = value.data;

        if (props.modelValue.value?.length > 0) {
            dataList.value = props.modelValue.value.split(',');
        }
    }
    isPopupShow.value = false;
}

function optionComponent() {
    if (props.codeData && props.codeData.item3) {
        return optionComponents[props.codeData.item3]?.default;
    }
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

    //font-size: 1.4rem;
}
</style>
