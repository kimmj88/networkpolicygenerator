<template>
    <div :id="id" tabindex="-1" aria-hidden="true"
        class="fixed top-0 left-0 right-0 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        ref="basePopup">
        <!-- Modal content -->
        <div class="relative w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700" :class="addClass">
            <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600"
                v-if="$slots.title">
                <h5 class="modal-title text-black dark:text-white font-medium">
                    <slot name="title"></slot>
                </h5>
                <AtomButton :type="'custom'"
                    :class-text="'text-gray-400 bg-transparent hover:bg-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'"
                    @click="close">
                    <template v-slot:msg>
                        <em class="bx bx-x text-2xl"></em>
                        <span class="sr-only">Close Modal</span>
                    </template>
                </AtomButton>
            </div>
            <!-- Modal body -->
            <div class="space-y-6 text-black dark:text-white"
                :class="addBodyClass + ($slots.mFooter ? '' : ' rounded-b')">
                <slot name="msg"></slot>
            </div>
            <!-- Modal footer -->
            <div class="flex items-center space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
                v-if="$slots.mFooter">
                <slot name="mFooter"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AtomButton from '@a/Button.vue';
import { onBeforeUnmount, onMounted, ref, toRefs } from 'vue';

const props = defineProps({
    id: {
        type: String,
        default: 'popupBase'
    },
    addClass: {
        type: String,
        default: ''
    },
    addBodyClass: {
        type: String,
        default: ''
    },
    cbFunc: {
        type: Function,
        required: false
    }
});

const { id, addClass, addBodyClass } = toRefs(props);
const basePopup = ref(null as any);

const emit = defineEmits(['close']);

function close() {
    if (props.cbFunc !== undefined && typeof props.cbFunc === 'function') {
        props.cbFunc();
    }
    emit('close');
}

onMounted(() => {
    document.body.appendChild(basePopup.value);
});
onBeforeUnmount(() => {
    document.body.removeChild(basePopup.value);
});
</script>

<style scoped>
.modal .show {
    background-color: var(--nvr-bg);
    opacity: 0.5;
}
</style>
