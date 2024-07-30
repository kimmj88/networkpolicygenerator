<template>
    <div class="p-4 flex flex-col gap-4">
        <div class="flex items-center ml-2">
            <div class="basis-1/3">{{ t('voca.ip.types.default') }}</div>
            <div class="basis-2/3">
                <CheckboxLikeRadio
                    :selected-value="ruleStore.ip_modal_data.dataType"
                    :label-list="IPTypes"
                    @update:selectedValue="updateSelectedValue"
                />
            </div>
        </div>
        <div v-if="ruleStore.ip_modal_data.dataType === 'Database'" class="flex flex-col gap-4">
            <MoleSelect
                v-if="ruleStore.ip_modal_data.dataType === 'Database'"
                :label-class-text="labelClassText"
                :label-text="t('voca.title.default')"
                :class-text="classText"
                :place-holder="t('msg.error.no_input.default')"
                :options="ruleStore.ip_variable_list"
                :get-option-label="(option: VariableIPType) => getIPOptionsLabel(option)"
                :reduce="(option: VariableIPType) => option.value"
                v-model="ruleStore.ip_modal_data.value"
                @click:option="(ip: string) => updateIPTitle(ip)"
            />
        </div>

        <div v-else>
            <div class="flex center items-center ml-2">
                <div class="basis-1/3">{{ t('voca.ip.default') }}</div>
                <div class="basis-2/3 mr-2 pl-1">
                    <ValidationInput
                        v-model="ruleStore.ip_modal_data.value"
                        :validate-func="IPValidationFunc"
                        :error-msg-func="
                            () => t('msg.error.invalid.format.ip.arg.default', [ruleStore.ip_modal_data.value])
                        "
                        :placeholder="t('msg.info.input.default')"
                        :enter-callback="addIP"
                    />
                </div>
            </div>
        </div>

        <div class="px-2 flex justify-end gap-2">
            <AtomButton :type="'save'" :button-name="t('btn.add.default')" @click="addIP" />
        </div>
    </div>
</template>

<script setup lang="ts">
const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';
const labelClassText = 'text-black w-full text-base';
const classText = 'text-black w-full text-base';

import ValidationInput from '@/components/base/atoms/ValidationInput.vue';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { IPRegexWithCIDR } from '@/plugins/ts/regex';
import { RuleHeaderDataType, TrafficDirectionType, VariableIPType, ruleStore } from '@/stores/modules/Rule';
import AtomButton from '@a/Button.vue';
import CheckboxLikeRadio from '@m/CheckboxLikeRadio.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import { computed, onBeforeMount, watch, watchEffect, type PropType } from 'vue';

const emit = defineEmits(['close']);

const { stores, emitter, gProp, commonts, router, t } = base();
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();
const { svcType, tabIdx, setEmptyMsg, setCodeMsg } = commonVar();

const props = defineProps({
    directionType: {
        type: String as PropType<TrafficDirectionType>,
        required: true
    },
    popupFlag: {
        type: Boolean,
        default: false
    },
    popupCloseFunc: Function,
    commonCode: {
        type: Object,
        required: true
    }
});

function IPValidationFunc(data: string) {
    return IPRegexWithCIDR.test(data);
}

const IPTypes = computed(() => {
    return props.commonCode.cmm203?.map((code: any) => code.cd);
});

watchEffect(() => {
    if (IPTypes.value && IPTypes.value.length > 0) {
        ruleStore.ip_modal_data.dataType = IPTypes.value[0];
    }
});

watch(
    () => ruleStore.ip_modal_data.dataType,
    async (_newType, _) => {
        ruleStore.initIPModalDataWithoutType();
        if (_newType === 'Database') {
            await ruleStore.getIPList();
        }
    }
);

function updateSelectedValue(value: RuleHeaderDataType) {
    ruleStore.ip_modal_data.dataType = value;
}

function addIP() {
    if (ruleStore.ip_modal_data.value === '') {
        let errorMsg = t('msg.error.no_input.select.ip.defafult');
        if (ruleStore.ip_modal_data.dataType === 'Manual') {
            errorMsg = t('msg.error.no_input.enter.ip.defafult');
        }
        commonts.notificationShow(gProp, 'error', errorMsg, -1);
        return;
    }
    ruleStore.addIPToRule(props.directionType);
    emit('close');
}

function getIPOptionsLabel(option: VariableIPType) {
    return `${option.key}(${option.value})`;
}

function updateIPTitle(ip: string) {
    const found = ruleStore.ip_variable_list.filter((data) => data.value === ip);
    if (found.length > 0) {
        ruleStore.ip_modal_data.title = found[0].key;
    }
}

onBeforeMount(() => {});
</script>

<style lang="scss" scoped></style>
