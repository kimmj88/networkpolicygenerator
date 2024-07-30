<template>
    <div class="flex flex-col gap-2">
        <div v-if="targetCommonCode" v-for="(cmCode, idx) in targetCommonCode">
            <CheckboxToggleWithInput
                v-if="!cmCode.item1.includes('cmm')"
                :checkbox-label="cmCode.cd"
                :checkbox-value="non_payload_data[getCheckboxLabel(cmCode.cd)]?.flag"
                @update:model-value:checkbox="(value) => (non_payload_data[getCheckboxLabel(cmCode.cd)].flag = value)"
                @update:model-value:input="(value) => (non_payload_data[getCheckboxLabel(cmCode.cd)].data = value)"
                :input-value="non_payload_data[getCheckboxLabel(cmCode.cd)].data"
            />
            <div v-else>
                <CheckBoxToggleWithSingleSelect
                    v-if="cmCode.item2 === 'SINGLE'"
                    :checkbox-label="cmCode.cd"
                    :checkbox-value="non_payload_data[getCheckboxLabel(cmCode.cd)].flag"
                    @update:model-value:checkbox="
                        (value: boolean) => (non_payload_data[getCheckboxLabel(cmCode.cd)].flag = value)
                    "
                    @update:model-value:input="
                        (value: string) => (non_payload_data[getCheckboxLabel(cmCode.cd)].data = value)
                    "
                    :select-list="(commonCode[cmCode.item1] as MngCodeWithMl[]).map((cd) => cd.cd)"
                    :input-value="non_payload_data[getCheckboxLabel(cmCode.cd)].data"
                    :detail-info="cmCode.item1"
                />
                <CheckboxToggleWithMultipleSelect
                    v-if="cmCode.item2 === 'MULTI'"
                    :checkbox-label="cmCode.cd"
                    :checkbox-value="non_payload_data[getCheckboxLabel(cmCode.cd)].flag"
                    @update:model-value:checkbox="
                        (value: boolean) => (non_payload_data[getCheckboxLabel(cmCode.cd)].flag = value)
                    "
                    @update:model-value:input="
                        (value: string) => (non_payload_data[getCheckboxLabel(cmCode.cd)].data = value)
                    "
                    :select-list="
                        (commonCode[cmCode.item1] as MngCodeWithMl[]).map((cd) => {
                            return { label: cd.cd, descriptopn: cd.cd_dc };
                        })
                    "
                    :input-value="non_payload_data[getCheckboxLabel(cmCode.cd)].data"
                    :detail-info="cmCode.cd_dc"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ruleStore } from '@/stores/modules/Rule';
import { MngCodeWithMl } from '@cm/types/domain/dao/mng/mngCode';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import CheckBoxToggleWithSingleSelect from './base/CheckBoxToggleWithSingleSelect.vue';
import CheckboxToggleWithInput from './base/CheckboxToggleWithInput.vue';
import CheckboxToggleWithMultipleSelect from './base/CheckboxToggleWithMultipleSelect.vue';

const { rule_header, non_payload_data } = storeToRefs(ruleStore);

const props = defineProps({
    commonCode: {
        type: Object,
        default: {}
    }
});

const targetCommonCode = computed(() => {
    switch (rule_header.value.protocol.toLowerCase()) {
        case 'ip':
            return { ...props.commonCode.cmm205 } as MngCodeWithMl[];
        case 'tcp':
            return { ...props.commonCode.cmm208 } as MngCodeWithMl[];
        case 'udp':
            return { ...props.commonCode.cmm210 } as MngCodeWithMl[];
        case 'icmp':
            return { ...props.commonCode.cmm212 } as MngCodeWithMl[];
    }
});

function getCheckboxLabel(optionName: string) {
    return optionName === 'id' ? 'ip_header_id' : optionName;
}
</script>

<style lang="scss" scoped></style>
