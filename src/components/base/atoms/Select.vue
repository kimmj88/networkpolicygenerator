<template>
    <div :id="id">
        <v-select :id="id" :name="name" :options="options" :placeholder="placeHolder" :value="modelValue"
            :model-value="modelValue" @update:modelValue="selectHandler" :get-option-label="getOptionLabel"
            :reduce="reduce" :disabled="disabled" :tabindex="tabindex" @open="openDropdownHandler"
            @close="closeDropdownHandler">
            <template v-slot:no-options>{{ t('msg.error.info.data.not_exist.default') }}</template>
            <template #search="{ attributes, events }">
                <AtomInput ref="inputRef" :id="id" :name="name" class="vs__search" style="width: min-content"
                    :class-text="classText" :custom-bind="attributes" :custom-on="events" />
            </template>
        </v-select>
    </div>
</template>
<script setup lang="ts">
interface SelectProps {
    id?: string;
    name?: string;
    options: any;
    modelValue: any;
    placeHolder?: string;
    getOptionLabel?: Function;
    reduce?: Function;
    classText?: string;
    disabled?: boolean;
    tabindex?: number;
    setFocus?: Function;
    openDropdownHandler?: Function;
    closeDropdownHandler?: Function;
}
import { base } from '@/plugins/ts/base';
import { clearMsgElement, setMsgElement } from '@/plugins/ts/validate';
import type { IInput } from '@/types/types';
import AtomInput from '@a/Input.vue';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, toRefs } from 'vue';

const props = withDefaults(defineProps<SelectProps>(), {
    disabled: false
});

const { options, modelValue, reduce, classText, disabled } = toRefs(props);

const id = computed(() => props.id ?? uuidv4());
const name = computed(() => props.name ?? uuidv4());

const getOptionLabel = computed(() => props.getOptionLabel);

const placeHolder = computed(() => {
    return props.placeHolder ?? t('msg.info.select.default');
});

const { t } = base();
const inputRef = ref<IInput | null>(null);
const emit = defineEmits(['update:modelValue', 'click:option']);
const selectHandler = (value: any) => {
    emit('update:modelValue', value);
    requiredValidator(value);
    clickOption(value);
};

const clickOption = (value: any) => {
    emit('click:option', value);
};

function requiredValidator(value: string) {
    if (classText?.value?.includes('required')) {
        let target = document?.getElementById(id.value)?.querySelector('.vs__search input') as HTMLElement;
        let dataObject = { className: 'single', multiFlag: false };
        if (classText?.value?.includes('multiple')) {
            dataObject = { className: 'multiple', multiFlag: true };
        }
        checkVueSelect(value, target, dataObject);
    }
}

function checkVueSelect(value: string, target: HTMLElement, data: { className: string; multiFlag: boolean }) {
    if (
        value !== null &&
        value !== undefined &&
        ((data?.multiFlag === true && value?.split(',')?.length > 0) || (data?.multiFlag === false && value !== ''))
    ) {
        clearMsgElement(target);
        return true;
    }

    if (!target?.getAttribute('disabled')) {
        setMsgElement(target, t('msg.error.no_input.contents.default'));
    }
    return false;
}

defineExpose<IInput>({
    focusInputRef() {
        inputRef.value?.focusInputRef();
    }
});
</script>

<style lang="scss" scoped>
div.atom:has(input[input-type='text']),
div.atom:has(input[input-type='password']) {
    border: 0px;
    background-color: transparent;
}

div.atom input.required,
div.atom input.required:focus {
    outline-width: 0px;
    outline-style: solid;
    outline-offset: 0px;
    outline-color: transparent;
    --tw-ring-shadow: none !important;
}

div.atom:has(input.required:not(.radio)) {
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -1px;
    outline-color: transparent !important;
}

div.v-select:has(input.required:not(.req-init)) {
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -1px;
    outline-color: var(--input-outline-required);
    border-radius: 4px;
}

div.v-select:has(input.required.complete) {
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -1px;
    outline-color: var(--input-outline-complete);
    border-radius: 4px;
}
</style>
