<template>
    <div class="checkbox__list">
        <div v-for="(label, idx) in labelList" class="checkbox">
            <Checkbox
                :id="label"
                :label="label"
                @update:model-value="() => onClickCheckbox(label)"
                v-model="selectedOne[label]"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Checkbox from '../atoms/Checkbox.vue';
const emit = defineEmits(['update:selectedValue']);
const props = defineProps({
    selectedValue: { type: String },
    labelList: {
        type: Array<string>,
        default: []
    },
    width: {
        type: String,
        default: '80%'
    }
});

const selectedOne = computed(() => {
    const result = {} as { [key: string]: boolean };
    for (const label of props.labelList) {
        result[label] = label === props.selectedValue;
    }
    return result;
});

function onClickCheckbox(value: string) {
    console.log('onClickCheckbox value is ---> ', value, 'selectedOne is ', selectedOne.value);
    emit('update:selectedValue', value);
}
</script>

<style lang="scss" scoped>
.checkbox__list {
    display: flex;
    justify-content: space-between;
    width: v-bind('width');

    .checkbox {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        &:hover {
            cursor: pointer;
        }
        label {
            cursor: inherit;
        }
        input[type='checkbox']:focus {
            outline: 2px solid transparent;
            box-shadow: 0 0 0 2px transparent;
        }
    }
}
</style>
