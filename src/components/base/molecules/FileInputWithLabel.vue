<template>
    <div class="molecule with-label inline-flex items-center justify-around w-full">
        <AtomLabel class="basis-1/3 pr-2 ml-2" :class-text="labelClassText" :label-text="labelText"></AtomLabel>
        <div class="basis-2/3 mr-2 h-10 inlien-flex flex-col justify-center items-center flex-grow">
            <AtomButton
                v-if="readonly && fileId != undefined && fileId != ''"
                :button-name="'btn.download.default'"
                :class="'w-full h-full lg:w-1/2'"
                :class-text="'w-full h-full text-base rounded-md py-2.5 focus:outline-none hover:brightness-75 bxc bxc-download'"
                :type="'run'"
                @click="goDownload(fileId)"
            />
            <AtomFileInput
                v-else-if="!readonly"
                class="inlien-flex flex-col justify-center items-center flex-grow"
                :id="id"
                :class-text="classText"
                :file="file"
                @update:model-value="updateValue"
                :tabindex="tabindex"
            />
            <div v-else class="h-10 ml-3 flex items-center">
                <span>{{ t('msg.error.info.file.not_exist.default') }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import AtomButton from '@a/Button.vue';
import AtomFileInput from '@a/FileInput.vue';
import AtomLabel from '@a/Label.vue';
import { v4 as uuidv4 } from 'uuid';
import { computed } from 'vue';

interface FileInputProps {
    id?: string;
    file: File | null;
    labelClassText?: string;
    labelText?: string;
    buttonText?: string;
    placeholder?: string;
    classText?: string;
    tabindex?: number;
    readonly?: boolean;
    fileId?: string;
}

const props = withDefaults(defineProps<FileInputProps>(), {
    labelClassText: 'text-white w-full text-xl',
    labelText: '',
    classText: ''
});

// library
const { t } = base();

const id = computed(() => props.id ?? uuidv4());
const emit = defineEmits(['update:modelValue', 'click:download']);
const updateValue = (value: any) => {
    emit('update:modelValue', value);
};
const goDownload = (fileId: string | undefined) => {
    console.log('goDownload', fileId);
    if (fileId) {
        emit('click:download', fileId);
    }
};
</script>
