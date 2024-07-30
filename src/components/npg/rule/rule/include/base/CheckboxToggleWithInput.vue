<template>
    <div>
        <ToggleCheckbox
            :label="checkboxLabel"
            :modelValue="checkboxValue"
            @update:model-value="(value: boolean) => $emit('update:modelValue:checkbox', value)"
        >
            <template v-slot:content>
                <ValidationInput
                    :model-value="inputValue"
                    @update:model-value="(value: string | number) => emit('update:modelValue:input', value)"
                />
            </template>
        </ToggleCheckbox>
    </div>
</template>

<script setup lang="ts">
import ValidationInput from '@/components/base/atoms/ValidationInput.vue';
import ToggleCheckbox from '@m/ToggleCheckbox.vue';

const emit = defineEmits(['update:modelValue:checkbox', 'update:modelValue:input']);

const props = defineProps({
    checkboxLabel: {
        type: String,
        required: true
    },
    checkboxValue: {
        type: Boolean,
        required: true
    },
    inputValue: {
        type: [String, Number]
    },
    detailInfo: {
        type: String
    }
});
</script>

<style lang="scss" scoped></style>
