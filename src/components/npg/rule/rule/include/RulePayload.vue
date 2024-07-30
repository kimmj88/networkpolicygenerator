<template>
    <div :class="cardClass" class="p-4">
        <ToggleCheckbox :label="t('voca.payload.default')" label-class="font-medium" v-model="ruleStore.payload_flag">
            {{ ruleStore.payload_data }}
            <template v-slot:content>
                <div class="flex flex-col gap-2 ml-2 border-l pl-4">
                    <!-- content -->
                    <div class="border pt-2 pl-2 rounded ml-2">
                        <ValidationInputWithLabel
                            :label="t('voca.content.default')"
                            v-model="ruleStore.payload_data.content"
                        />
                        <div class="flex gap-4 ml-2">
                            <Checkbox :label="t('voca.negation.default')" v-model="ruleStore.payload_data.negation" />
                            <Checkbox
                                :label="t('voca.fast_pattern.default')"
                                :model-value="!!ruleStore.payload_data.fast_pattern"
                                @update:model-value="
                                    (value) => (ruleStore.payload_data.fast_pattern = value ? 'fast_pattern' : '')
                                "
                            />
                        </div>
                    </div>

                    <!-- content-modifier -->
                    <div class="pl-2">
                        <ToggleCheckbox
                            :label="t('voca.content.modifier.default')"
                            label-class="font-medium"
                            v-model="ruleStore.content_modifier_flag"
                            :fold-callback="initBasicOptionData"
                        >
                            <template v-slot:content>
                                <div class="flex flex-col gap-4 border pl-4 rounded">
                                    <ContentModifier :common-code="commonCode" />
                                </div>
                            </template>
                        </ToggleCheckbox>
                    </div>

                    <!-- pcre -->
                    <ValidationInputWithLabel
                        :label="t('voca.pcre.default')"
                        v-model="ruleStore.payload_data.pcre"
                        :validate-func="
                            (data: string | number) => {
                                if (typeof data === 'string') return getLengthRegx(100).test(data);
                                return true;
                            }
                        "
                        :error-msg-func="
                            () => t('msg.error.invalid.format.sid.arg.default', [ruleStore.payload_data.pcre])
                        "
                    />
                </div>
            </template>
        </ToggleCheckbox>
    </div>
</template>

<script setup lang="ts">
const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';

import Checkbox from '@/components/base/atoms/Checkbox.vue';
import ValidationInputWithLabel from '@/components/base/molecules/ValidationInputWithLabel.vue';
import { base } from '@/plugins/ts/base';
import { getLengthRegx } from '@/plugins/ts/regex';
import { ruleStore } from '@/stores/modules/Rule';
import ToggleCheckbox from '@m/ToggleCheckbox.vue';
import ContentModifier from './ContentModifier.vue';

const { t } = base();
const props = defineProps({
    commonCode: {
        type: Object,
        default: {}
    }
});

function initBasicOptionData() {
    ruleStore.initContentModifier();
}
</script>

<style lang="scss" scoped></style>
