<template>
    <div class="checkbox__wrapper">
        <div class="checkbox__header">
            <div class="checkbox__label__wrapper">
                <button
                    class="checkbox__btn"
                    @click.prevent="onClickCheckbox"
                    :aria-checked="model"
                    :data-state="model"
                >
                    <span v-if="model">
                        <CheckSvgIcon size="15" />
                    </span>
                </button>
                <input type="checkbox" v-model="model" class="checkbox__input" aria-hidden="true" tabindex="-1" />
                <div @click="onClickCheckbox" :class="`checkbox__label ${labelClass}`">{{ label }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import CheckSvgIcon from '@/components/base/svgs/CheckSvgIcon.vue';

const props = defineProps({
    label: { type: String, default: '' },
    labelClass: { type: String, default: '' },
    boxSize: { type: String, default: '20px' }
});

const model = defineModel({ type: Boolean });
const emit = defineEmits(['update:modelValue']);

function onClickCheckbox() {
    emit('update:modelValue', !model.value);
}
</script>

<style lang="scss" scoped>
.checkbox__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 3.5rem;
}

.checkbox__label__wrapper {
    display: flex;
    align-items: center;
    &:hover {
        cursor: pointer;
    }

    .checkbox__btn {
        all: unset;
        cursor: pointer;
        width: v-bind('boxSize');
        height: v-bind('boxSize');
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    .checkbox__input {
        transform: translateX(-100%);
        position: absolute;
        pointer-events: none;
        opacity: 0;
        margin: 0px;
        width: 25px;
        height: 25px;
    }

    .checkbox__label {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 10px;

        position: relative;
    }
}
</style>
