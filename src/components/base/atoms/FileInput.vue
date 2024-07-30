<template>
    <div class="atom w-full relative">
        <label
            :for="id"
            @dragover.prevent
            @dragenter.prevent
            @drop.prevent="fileUploadHandler"
            class="relative z-1 flex w-full items-center h-10 border border-gray-300 cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            :tabindex="tabindex"
        >
            <span class="h-full bg-gray-800 text-white text-sm px-4 py-2 flex items-center font-medium">{{
                buttonText || t('btn.file.select.default')
            }}</span>
            <div class="file__text pl-2 text-sm text-gray-500 dark:text-gray-400">
                <span>
                    {{
                        !file || file.name.length <= 0
                            ? placeholder || t('msg.error.no_input.select.file.drag.default')
                            : file.name
                    }}
                </span>
                <i
                    v-if="alertShow"
                    :id="triggerId"
                    class="alert-msg bx bx-message-alt-x hidden"
                    :class="'text-red-600'"
                    @click="tooltip.show()"
                ></i>
                <i
                    v-if="fileName"
                    class="init-btn bx bx-x"
                    :class="iconColor"
                    @click.stop.prevent="(e) => fileUploadHandler(e)"
                ></i>
                <div
                    :id="targetId"
                    role="tooltip"
                    class="absolute z-[210] invisible inline-block px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                >
                    <div :class="'tooltip-msg-' + triggerId">
                        {{ t('msg.error.no_input.select.file.defafult') }}
                    </div>
                    <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
            </div>
        </label>
        <input
            :id="id"
            ref="fileInputRef"
            class="hidden file__input"
            :class="classText"
            type="file"
            @click="fileUploadHandler"
            @change="fileUploadHandler"
        />
    </div>
</template>

<script setup lang="ts">
interface FileInputProps {
    id?: string;
    file: File | null;
    buttonText?: string;
    placeholder?: string;
    classText?: string;
    tabindex?: number;
}
import { base } from '@/plugins/ts/base';
import { clearMsgElement, setMsgElement } from '@/plugins/ts/validate';
import { Tooltip } from 'flowbite';
import { v4 as uuidv4 } from 'uuid';
import { computed, onMounted, ref, toRefs, watch, type Ref } from 'vue';

const { t } = base();
const fileInputRef: Ref<HTMLInputElement | null> = ref(null);
const props = defineProps<FileInputProps>();
const { file, buttonText, placeholder, classText } = toRefs(props);
const emit = defineEmits(['update:modelValue', 'test']);

const id = computed(() => props.id ?? uuidv4());

const targetId = ref(uuidv4());
const triggerId = ref(uuidv4());
const alertShow = true;
const tooltip = ref(null as any);

const fileName = computed(() => {
    if (file.value) {
        return file.value.name;
    }
    return null;
});

const iconColor = computed(() => {
    let retClass = '';
    classText?.value?.split(' ').forEach((data) => {
        if (data.startsWith('text-')) {
            retClass += data;
        }
    });
    return retClass;
});

function fileUploadHandler(e: any) {
    let files: FileList | null = null;
    if (e instanceof DragEvent) {
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        }
    } else {
        //Input Event
        const target = e.target as HTMLInputElement;
        files = target.files;
    }
    emit('update:modelValue', files);
}

watch(
    () => fileName.value,
    (curr: string | null) => {
        if (curr && curr.length > 0) {
            fileInputRef.value?.classList.add('complete');
            fileInputRef.value?.parentElement?.querySelector('.alert-msg')?.classList.add('hidden');
            if (fileInputRef.value) {
                clearMsgElement(fileInputRef.value);
            }
        } else {
            fileInputRef.value?.classList.remove('complete');
            fileInputRef.value?.parentElement?.querySelector('.alert-msg')?.classList.remove('hidden');
            if (fileInputRef.value) {
                setMsgElement(fileInputRef.value, t('msg.error.no_input.contents.default'));
            }
        }
    }
);

onMounted(() => {
    // tooltip 초기화
    const tooltipTarget = document.getElementById(targetId.value);
    const tooltipTrigger = document.getElementById(triggerId.value);
    if (tooltipTarget !== null && tooltipTarget !== undefined) {
        tooltip.value = new Tooltip(tooltipTarget, tooltipTrigger);
    }
});
</script>

<style lang="scss" scoped>
div.atom:has(input.required:not(.radio):not(.req-init)) label,
div.atom:has(i.alert-msg:not(.hidden)) label {
    width: calc(100% - 2px);
    margin-left: 2px;
    span {
        border-top-left-radius: 2px;
        border-bottom-left-radius: 2px;
    }
}
label {
    width: 100%;
    height: 42px;
    border-radius: 4px;

    span {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    .file__text {
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 1rem;
        white-space: nowrap;
        overflow: hidden;
        span {
            width: 100%;
        }
    }
}
span {
    min-width: 90px;
}
div.atom i {
    font-size: 1.4rem;
    cursor: pointer;
    margin-right: 0.5rem;
}
div.atom i.alert-msg.hidden {
    display: none;
}

div.atom input.required,
div.atom input.required:focus {
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -2px;
    outline-color: transparent;
    --tw-ring-shadow: none !important;
}

div.atom:has(input.required:not(.radio):not(.req-init)) label,
div.atom:has(i.alert-msg:not(.hidden)) label {
    outline-width: 2px;
    outline-style: solid;
    outline-offset: -1px;
    outline-color: var(--input-outline-required);
}

div.atom:has(input.required.complete:not(.radio)) label {
    outline-color: var(--input-outline-complete);
}
</style>
