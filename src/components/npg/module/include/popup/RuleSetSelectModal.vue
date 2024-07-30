<template>
    <div class="p-2">
        <!-- ctrl area -->
        <div class="basis-2/3 inlien-flex flex-col justify-center flex-grow flex py-4">
            <!-- listbox -->
            <div class="list_container h-36">
                <div v-for="(item, idx) in ruleSets" class="list_item flex-row flex">
                    <div class="list_item_left basis-9/10 w-full flex-row flex h-7 items-center">
                        <AtomInput :input-type="'checkbox'" class="basis-[2%] row-item flex justify-center"
                            v-model="checkDatas[item.id].checked" :true-value="true" :false-value="false" />
                        <AtomLabel :class-text="labelClassText" :label-text="item.title" class="text-center pl-2" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between pt-1">
            <div class="label h-12 inline-flex items-center"></div>
            <div class="commandBtn flex items-end justify-items-end">
                <AtomButton :button-name="t('btn.add.default')" @click="onClickedAdd" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import AtomButton from '@a/Button.vue';
import AtomInput from '@a/Input.vue';
import AtomLabel from '@a/Label.vue';
import { RulesetDTO } from '@cm/types/domain/dto/ruleset/rulesetDTO';
import { requestManager } from '@cm/types/domain/apis/common';
import { onMounted, ref, watch } from 'vue';

interface CheckData {
    [key: string]: {
        id: number;
        title: string;
        checked: boolean;
    };
}

const props = defineProps({
    popupList: Array<string>
});

const labelClassText = 'text-black w-full text-base';

const ruleSets = ref<RulesetDTO[]>([]);
const checkDatas = ref<CheckData>({});

const { t, commonts, gProp } = base();
const emit = defineEmits(['close']);

onMounted(() => {
    getRulesets();
});

watch(
    () => ruleSets.value,
    () => {
        ruleSets.value.forEach((item) => {
            checkDatas.value[item.id.toString()] = {
                id: item.id,
                title: item.title,
                checked: false
            };
        });
        initCheckDatas();
    }
);

function getRulesets() {
    requestManager.call(commonts.getUrl(gProp, '/ruleset/all'), {}).then((res) => {
        if (res.status == 200) {
            ruleSets.value = res.data as any;
        }
    });
}

function onClickedAdd() {
    const checkedItems = [];
    for (const key in checkDatas.value) {
        if (checkDatas.value[key] && checkDatas.value[key].checked) {
            checkedItems.push(checkDatas.value[key].title);
        }
    }

    if (checkedItems.length <= 0) {
        gProp?.$commonts.notificationShow(gProp, 'error', t('msg.error.no_input.select.default'));
        return;
    }

    emit('close', {
        data: checkedItems.join(',')
    });
}

function initCheckDatas() {
    for (const key in checkDatas.value) {
        checkDatas.value[key].checked = false;
        if (props.popupList?.includes(checkDatas.value[key].title)) {
            checkDatas.value[key].checked = true;
        }
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
}
</style>
