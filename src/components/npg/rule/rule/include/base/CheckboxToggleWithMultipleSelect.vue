<template>
    <div :class="`${checkboxValue && 'border rounded px-4'}`">
        {{ detailInfo }}
        <ToggleCheckbox
            :label="checkboxLabel"
            :modelValue="checkboxValue"
            @update:model-value="(value: boolean) => $emit('update:modelValue:checkbox', value)"
        >
            <template v-slot:content>
                <div class="pb-4">
                    <div class="flex flex-col gap-4 justify-around ml-2 border-l pl-4">
                        <div class="flex gap-4 justify-around">
                            <div v-for="({ label, descriptopn }, idx) in selectList" class="checkbox__item">
                                <!-- <div class="item__detail">{{ descriptopn && descriptopn }}</div> -->
                                <Checkbox
                                    :label="label"
                                    @update:model-value="(value: boolean) => updateSelectedValue(value, label)"
                                    :model-value="checkboxMap[label]"
                                />
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center p-2">
                                <span class="font-semibold"> Preview </span>
                                <AtomButton
                                    :type="'delete'"
                                    :button-name="t('btn.clear.all.default')"
                                    @click="clearSelectedValues"
                                />
                            </div>
                            <div class="border rounded p-2 flex justify-center items-center min-h-14 font-bold">
                                {{ selectedValue.join('') }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </ToggleCheckbox>
    </div>
</template>

<script setup lang="ts">
import Checkbox from '@/components/base/atoms/Checkbox.vue';
import { base } from '@/plugins/ts/base';
import { SelectItemType, SelectListType } from '@/types/types';
import AtomButton from '@a/Button.vue';
import ToggleCheckbox from '@m/ToggleCheckbox.vue';
import { Ref, ref } from 'vue';

const { stores, emitter, gProp, commonts, router, t } = base();
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
        type: Array<SelectItemType>,
        required: true
    },
    detailInfo: {
        type: String
    }
});

const selectedValue: Ref<string[]> = ref(props.inputValue ? props.inputValue.split('') : []);
const checkboxMap = {} as { [key: string]: boolean };
initCheckBoxMap();

function updateSelectedValue(value: boolean, label: string) {
    checkboxMap[label] = value;
    if (value) {
        selectedValue.value.push(label);
    } else {
        selectedValue.value = selectedValue.value.filter((selected) => selected !== label);
    }
    emit('update:modelValue:input', selectedValue.value.join(''));
}

function initCheckBoxMap() {
    for (const { label } of props.selectList) {
        checkboxMap[label] = selectedValue.value.includes(label);
    }
}

function clearSelectedValues() {
    selectedValue.value = [];
    initCheckBoxMap();
    emit('update:modelValue:input', selectedValue.value.join(''));
}
</script>

<style lang="scss" scoped>
.checkbox__item {
    position: relative;
    .item__detail {
        display: none;
    }
    &:hover {
        .item__detail {
            position: absolute;
            display: block;
            max-width: 300px;
            background-color: rgba(115, 115, 115, 0.9);
            top: -60px;
            left: 20px;
        }
    }
}
</style>
