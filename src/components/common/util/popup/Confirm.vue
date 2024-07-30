<template>
    <div
        :id="id"
        tabindex="-1"
        aria-hidden="true"
        class="fixed top-0 left-0 right-0 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
        <div class="relative w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="modal-header w-full h-12 inline-flex justify-between items-center border-b">
                    <h5 class="modal-title text-black dark:text-white ml-3">
                        {{ title }}
                    </h5>
                    <AtomButton
                        v-if="type === 'YN'"
                        :type="'custom'"
                        :class-text="'text-gray-400 bg-transparent hover:bg-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white mr-2'"
                        @click="close"
                    >
                        <template v-slot:msg>
                            <em class="bx bx-x text-2xl"></em>
                            <span class="sr-only">Close Modal</span>
                        </template>
                    </AtomButton>
                </div>
                <div class="modal-body p-6">
                    <p>
                        {{ msg }}
                    </p>
                </div>
                <div class="modal-footer w-full inline-flex justify-around items-center p-3">
                    <AtomButton
                        v-if="type === 'YN' || type === 'N'"
                        :button-name="disableText"
                        @click="confirm(false)"
                        :type="'delete'"
                        :class-text="'w-full min-w-[7rem] h-12 text-xl rounded-md pl-2 pr-3 py-2.5 focus:outline-none hover:brightness-75 bxc bxc-x'"
                    />
                    <AtomButton
                        v-if="type === 'YN' || type === 'Y'"
                        :button-name="ableText"
                        @click="confirm(true)"
                        :type="'save'"
                        :class-text="'w-full min-w-[7rem] h-12 text-xl rounded-md pl-2 pr-3 py-2.5 focus:outline-none hover:brightness-75 bxc bxc-check'"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AtomButton from '@a/Button.vue';
import { onMounted, toRefs } from 'vue';

const props = defineProps({
    id: {
        type: String,
        default: 'ConfirmPopup'
    },
    title: String,
    msg: String,
    type: String,
    cbFunc: Function,
    ableText: {
        type: String,
        default: 'btn.confirm.default'
    },
    disableText: {
        type: String,
        default: 'btn.cancel.default'
    }
});

const { id, title, msg, type, ableText, disableText } = toRefs(props);

const emit = defineEmits(['close']);

const confirm = (flag: boolean) => {
    close();
    if (props.cbFunc !== undefined && typeof props.cbFunc === 'function') {
        props.cbFunc(flag);
    }
};

const close = () => {
    emit('close');
};

onMounted(() => {});
</script>
