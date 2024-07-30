<template>
    <div :class="cardClass" class="rule__preview">
        <div class="font-bold">Preview</div>
        <Textarea
            v-model="ruleStore.preview"
            label-text="preview"
            :labelClassText="labelClassText"
            textareaClass="w-full text-xl"
            :readonly="true"
            :rows="3"
        />
    </div>
</template>

<script setup lang="ts">
const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 rounded';
const labelClassText = 'text-black w-full text-base font-medium';

import Textarea from '@/components/base/atoms/Textarea.vue';
import { ruleStore } from '@/stores/modules/Rule';
// const props = defineProps({});
</script>

<style lang="scss" scoped>
.rule__preview {
    width: calc(100% + 20px);
    padding: 1rem;
    position: sticky;
    z-index: 10;
    bottom: 0;
    transform: translateX(-10px) translateY(+15px);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1.2rem;

    /**
     * glassmorphism effect
     */
    background: rgba(255, 255, 255, 0.55);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.18);
}
</style>
