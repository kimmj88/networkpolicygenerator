<template>
    <div class="p-2 flex flex-col">
        <div class="flex items-center ml-2">
            <div class="basis-1/3"></div>
            <div class="basis-2/3">
                <CheckboxLikeRadio
                    :selected-value="ruleStore.content_modifier_type"
                    :label-list="contentModifierType"
                    @update:selectedValue="updateSelectedValue"
                />
            </div>
        </div>
        <div v-if="ruleStore.content_modifier_type === 'offset, depth'" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <ValidationInputWithLabel
                    :label="t('voca.offset.default')"
                    v-model="ruleStore.payload_data.offset"
                    input-type="number"
                />
                <ValidationInputWithLabel
                    :label="t('voca.depth.default')"
                    v-model="ruleStore.payload_data.depth"
                    input-type="number"
                />
            </div>
        </div>

        <div v-else>
            <div class="flex flex-col gap-2">
                <ValidationInputWithLabel
                    :label="t('voca.distance.default')"
                    v-model="ruleStore.payload_data.distance"
                    input-type="number"
                />
                <ValidationInputWithLabel
                    :label="t('voca.within.default')"
                    v-model="ruleStore.payload_data.within"
                    input-type="number"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ValidationInputWithLabel from '@/components/base/molecules/ValidationInputWithLabel.vue';
import { base } from '@/plugins/ts/base';
import { ruleStore } from '@/stores/modules/Rule';
import CheckboxLikeRadio from '@m/CheckboxLikeRadio.vue';
import { computed, onMounted, ref } from 'vue';

const test = ref('');
const emit = defineEmits(['close']);

const { t } = base();

const props = defineProps({
    commonCode: {
        type: Object,
        required: true
    }
});
const contentModifierType = computed(() => {
    return props.commonCode.cmm204?.map((code: any) => code.cd);
});

function updateSelectedValue(value: string) {
    ruleStore.initContentModifierData();
    ruleStore.content_modifier_type = value;
}

onMounted(() => {
    //Detail에 세팅된 값이 없을 경우에만, 기본값 offset으로 설정
    if (
        !ruleStore.content_modifier_type &&
        ruleStore.content_modifier_type.length === 0 &&
        contentModifierType.value &&
        contentModifierType.value.length > 0
    ) {
        ruleStore.content_modifier_type = contentModifierType.value[0];
    }
});
</script>

<style lang="scss" scoped></style>
