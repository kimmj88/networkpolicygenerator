<template>
    <div :class="`${checkboxValue && 'border rounded px-4'}`">
        <ToggleCheckbox
            :label="checkboxLabel"
            :modelValue="checkboxValue"
            @update:model-value="(value: boolean) => $emit('update:modelValue:checkbox', value)"
        >
            <template v-slot:content>
                <div class="pb-4">
                    <div class="flex flex-col justify-around gap-2 ml-2 border-l pl-4">
                        <CheckboxLikeRadio
                            :label-list="selectList"
                            :selected-value="selectedValue"
                            @update:selected-value="updateSelectedValue"
                            width="100%"
                        />
                    </div>
                </div>
            </template>
        </ToggleCheckbox>
    </div>
</template>

<script setup lang="ts">
import CheckboxLikeRadio from '@/components/base/molecules/CheckboxLikeRadio.vue';
import ToggleCheckbox from '@m/ToggleCheckbox.vue';
import { ref } from 'vue';

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
        type: String
    },
    selectList: {
        type: Array<string>,
        required: true
    },
    detailInfo: {
        type: String
    }
});

const selectedValue = ref(props.inputValue);
function updateSelectedValue(value: string) {
    console.log('check selectedValue.value, ', value);
    selectedValue.value = value;
    emit('update:modelValue:input', value);
}
</script>

<style lang="scss" scoped></style>
