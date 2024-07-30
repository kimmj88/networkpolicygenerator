<template>
    <div class="atom">
        <button type="button" :class="modifyClass" :disabled="disabled">
            <a v-if="!$slots.msg">{{ getButtonText() }}</a>
            <slot name="msg"></slot>
        </button>
    </div>
</template>

<script setup lang="ts">
// import
import { base } from '@/plugins/ts/base';
import { ref, toRefs } from 'vue';

type buttonType = 'search' | 'list' | 'create' | 'save' | 'delete' | 'import' | 'export' | 'run' | 'custom';

// props
const props = defineProps({
    buttonName: {
        type: String,
        default: 'btn.default'
    },
    type: {
        type: String as () => buttonType,
        default: 'default'
    },
    classText: {
        type: String,
        default:
            'w-full h-12 text-base rounded-md py-2 focus:outline-none hover:brightness-75 min-w-[7rem] min-h-[3rem]'
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

// library
const { t } = base();

// props to variable, define variable
const { buttonName, type, classText, disabled } = toRefs(props);
const buttonList = {
    custom: '',
    search: 'text-white bg-neutral-800 dark:bg-neutral-600',
    list: 'text-white bg-neutral-950 dark:bg-neutral-600',
    create: 'text-white bg-green-500',
    save: 'text-white bg-green-500',
    delete: 'text-white bg-red-700',
    import: 'text-white bg-gray-700',
    export: 'text-white bg-gray-700',
    run: 'text-white bg-blue-600',
    default: 'text-white bg-blue-700'
} as any;

const modifyClass = ref(
    classText.value.concat(
        ' ',
        buttonList[type.value.toLowerCase()],
        ' ',
        disabled.value === true ? 'cursor-not-allowed' : ''
    )
);

// function
function getButtonText() {
    return buttonName.value.startsWith('btn.') ? t(buttonName.value) : buttonName.value;
}
</script>

<style scoped lang="scss">
.responsive_btn {
    display: flex;
    justify-content: center;
}

button a {
    word-break: normal;
    word-wrap: break-word;
    vertical-align: middle;
    overflow: hidden;
    padding-bottom: 0.2rem;
}

@media (max-width: 1520px) {
    .responsvie_btn {
        min-width: fit-content;
        &.bxc-download:before {
            margin-right: 0;
            font-size: 1.75rem !important;
        }
        a {
            display: none;
        }
    }
}
</style>
