<template>
    <div :class="cardClass" class="p-4">
        <ToggleCheckbox
            :label="t('voca.non_payload.default')"
            label-class="font-medium"
            v-model="ruleStore.non_payload_flag"
        >
            <template v-slot:content>
                <div class="flex flex-col gap-2 ml-2 border-l pl-4">
                    <div v-if="!(ruleStore.rule_header.protocol && ruleStore.rule_header.protocol.length > 0)">
                        <span>Please select protocol in header first.</span>
                    </div>
                    <div v-else>
                        <NonPayload :common-code="commonCode" />
                    </div>
                </div>
            </template>
        </ToggleCheckbox>
    </div>
</template>

<script setup lang="ts">
const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';

import { base } from '@/plugins/ts/base';
import { ruleStore } from '@/stores/modules/Rule';
import ToggleCheckbox from '@m/ToggleCheckbox.vue';
import NonPayload from './NonPayload.vue';

const { t } = base();

const props = defineProps({
    commonCode: {
        type: Object,
        default: {}
    }
});
</script>

<style lang="scss" scoped></style>
