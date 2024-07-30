<template>
    <div class="flex flex-col gap-2">
        <!-- track -->
        <MoleSelect
            :label-class-text="labelClassText"
            :label-text="t('voca.service.type.default')"
            :placeholder="$t('msg.info.select.default')"
            :options="commonCode.cmm215"
            :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
            :reduce="(option: any) => option?.cd"
            v-model="ruleStore.post_detection_data.track"
        />
        <!-- count -->
        <ValidationInputWithLabel
            :label="t('voca.count.default').toLowerCase()"
            v-model="ruleStore.post_detection_data.count"
            :input-type="'number'"
        />
        <!-- seconds -->
        <ValidationInputWithLabel
            :label="t('voca.seconds.default')"
            v-model="ruleStore.post_detection_data.seconds"
            :input-type="'number'"
        />
    </div>
</template>

<script setup lang="ts">
const labelClassText = 'text-black w-full h-10 text-base';

import ValidationInputWithLabel from '@/components/base/molecules/ValidationInputWithLabel.vue';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { ruleStore } from '@/stores/modules/Rule';
import MoleSelect from '@m/SelectWithLabel.vue';
const { svcType, tabIdx, setCodeMsg, setEmptyMsg } = commonVar();

const { t } = base();
const props = defineProps({
    commonCode: {
        type: Object,
        default: {}
    }
});
</script>

<style lang="scss" scoped></style>
