<template>
    <ToggleCheckbox
        :label="t('voca.detection.filter.default')"
        label-class="font-medium"
        v-model="ruleStore.detection_filter_flag"
    >
        <template v-slot:content>
            <div class="flex flex-col gap-2 ml-2 border-l pl-4">
                <DetectionFilter :common-code="commonCode" />
            </div>
        </template>
    </ToggleCheckbox>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import { ruleStore } from '@/stores/modules/Rule';
import ToggleCheckbox from '@m/ToggleCheckbox.vue';
import DetectionFilter from './DetectionFilter.vue';

const { t } = base();

const props = defineProps({
    commonCode: {
        type: Object,
        default: {}
    }
});
</script>

<style lang="scss" scoped></style>
