<template>
    <div class="p-4 flex flex-col gap-4">
        <div class="flex items-center ml-2">
            <div class="basis-1/3">{{ t('voca.port.types.default') }}</div>
            <div class="basis-2/3">
                <CheckboxLikeRadio
                    :selected-value="ruleStore.port_modal_data.dataType"
                    :label-list="portTypes"
                    @update:selectedValue="updateSelectedValue"
                />
            </div>
        </div>
        <div v-if="ruleStore.port_modal_data.dataType === 'Database'" class="flex flex-col gap-4">
            <MoleSelect
                v-if="ruleStore.port_modal_data.dataType === 'Database'"
                :label-class-text="labelClassText"
                :label-text="t('voca.title.default')"
                :class-text="classText"
                :place-holder="t('msg.error.no_input.default')"
                :options="ruleStore.port_variable_list"
                :get-option-label="(option: VariableIPType) => getIPOptionsLabel(option)"
                :reduce="(option: VariableIPType) => option.value"
                v-model="ruleStore.port_modal_data.value"
                @click:option="(ip: string) => updateIPTitle(ip)"
            />
        </div>

        <div v-else>
            <div class="flex center items-center ml-2">
                <div class="basis-1/3">{{ t('voca.port.default') }}</div>
                <div class="basis-2/3 mr-2 pl-1">
                    <ValidationInput
                        v-model="ruleStore.port_modal_data.value"
                        :validate-func="portValidationFunc"
                        :error-msg-func="
                            () => t('msg.error.invalid.format.port.arg.default', [ruleStore.port_modal_data.value])
                        "
                        :placeholder="t('msg.info.input.default')"
                        :enter-callback="addPort"
                    />
                </div>
            </div>
        </div>

        <div class="px-2 flex justify-end gap-2">
            <AtomButton :type="'save'" :button-name="t('btn.add.default')" @click="addPort" />
        </div>
    </div>
</template>

<script setup lang="ts">
const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';
const labelClassText = 'text-black w-full text-base';
const classText = 'text-black w-full text-base';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';
const listBtnClassText = 'w-full text-base rounded-md px-2 py-1.5 focus:outline-none hover:brightness-75';

import ValidationInput from '@/components/base/atoms/ValidationInput.vue';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { PortRegex } from '@/plugins/ts/regex';
import { RuleHeaderDataType, TrafficDirectionType, VariableIPType, ruleStore } from '@/stores/modules/Rule';
import AtomButton from '@a/Button.vue';
import CheckboxLikeRadio from '@m/CheckboxLikeRadio.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import { PropType, computed, onBeforeMount, ref, watch, watchEffect } from 'vue';

const test = ref('');
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

function portValidationFunc(data: string) {
    return PortRegex.test(data);
}

const portTypes = computed(() => {
    return props.commonCode.cmm203?.map((code: any) => code.cd);
});

watchEffect(() => {
    if (portTypes.value && portTypes.value.length > 0) {
        ruleStore.port_modal_data.dataType = portTypes.value[0];
    }
});

watch(
    () => ruleStore.port_modal_data.dataType,
    async (_newType, _) => {
        ruleStore.initPortModalDataWithoutType();
        if (_newType === 'Database') {
            await ruleStore.getPortList();
        }
    }
);

function updateSelectedValue(value: RuleHeaderDataType) {
    ruleStore.port_modal_data.dataType = value;
}

function addPort() {
    if (ruleStore.port_modal_data.value === '') {
        let errorMsg = t('msg.error.no_input.select.port.defafult');
        if (ruleStore.port_modal_data.dataType === 'Manual') {
            errorMsg = t('msg.error.no_input.enter.port.defafult');
        }
        commonts.notificationShow(gProp, 'error', errorMsg, -1);
        return;
    }
    ruleStore.addPortToRule(props.directionType);
    emit('close');
}

function getIPOptionsLabel(option: VariableIPType) {
    return `${option.key}(${option.value})`;
}

function updateIPTitle(ip: string) {
    const found = ruleStore.port_variable_list.filter((data) => data.value === ip);
    if (found.length > 0) {
        ruleStore.port_modal_data.title = found[0].key;
    }
}

onBeforeMount(() => {});
</script>

<style lang="scss" scoped></style>
