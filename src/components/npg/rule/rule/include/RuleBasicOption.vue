<template>
    <div :class="cardClass" class="p-4">
        <ToggleCheckbox
            :label="t('voca.basic.options.default')"
            label-class="font-medium"
            v-model="ruleStore.basic_option_flag"
            :readonly="true"
        >
            <template v-slot:content>
                <div class="flex flex-col gap-4 ml-2 border-l pl-4">
                    <ValidationInputWithLabel
                        :label="t('voca.msg.acronym.default')"
                        v-model="ruleStore.basic_options.msg"
                        :required="true"
                    />
                    <ValidationInputWithLabel
                        :label="t('voca.gid.default')"
                        v-model="ruleStore.basic_options.gid"
                        :validate-func="validateNumber"
                        :error-msg-func="
                            () => t('msg.error.invalid.format.gid.arg.default', [ruleStore.basic_options.gid])
                        "
                        input-type="number"
                    />
                    <ValidationInputWithLabel
                        :label="t('voca.sid.default')"
                        v-model="ruleStore.basic_options.sid"
                        :required="true"
                        :validate-func="validateNumber"
                        :error-msg-func="
                            () => t('msg.error.invalid.format.sid.arg.default', [ruleStore.basic_options.sid])
                        "
                        input-type="number"
                    />
                    <ValidationInputWithLabel
                        :label="t('voca.rev.default')"
                        v-model="ruleStore.basic_options.rev"
                        :required="true"
                        :validate-func="validateNumber"
                        :error-msg-func="
                            () => t('msg.error.invalid.format.rev.arg.default', [ruleStore.basic_options.rev])
                        "
                        input-type="number"
                    />
                </div>
            </template>
        </ToggleCheckbox>
    </div>
</template>

<script setup lang="ts">
const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';
const labelClassText = 'text-black w-full text-base';
const classText = 'text-black w-full text-base';

import ValidationInputWithLabel from '@/components/base/molecules/ValidationInputWithLabel.vue';
import { base } from '@/plugins/ts/base';
import { SidRegex } from '@/plugins/ts/regex';
import { ruleStore } from '@/stores/modules/Rule';
import MoleInput from '@m/InputWithLabel.vue';
import ToggleCheckbox from '@m/ToggleCheckbox.vue';

const { stores, emitter, gProp, commonts, router, t } = base();
// const { basic_options } = storeToRefs(ruleStore);
function validateNumber(data: string) {
    return SidRegex.test(data);
}

function initBasicOptionData() {
    ruleStore.initBasicOptionData();
}
</script>

<style lang="scss" scoped></style>
