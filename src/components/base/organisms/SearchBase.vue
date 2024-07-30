<template>
    <div class="custom__card search__box__wrapper">
        <div
            class="flex items-center justify-between pl-4 p-2 border-b rounded-t dark:border-gray-600"
            v-if="$slots.title"
        >
            <h5 class="modal-title text-black dark:text-white font-bold">
                <slot name="title"></slot>
            </h5>
            <AtomButton
                :type="'custom'"
                :class-text="'text-gray-400 bg-transparent hover:bg-gray-400 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'"
                @click="toggle"
            >
                <template v-slot:msg>
                    <em class="bx bx-minus text-2xl"></em>
                    <span class="sr-only">Toggle Search</span>
                </template>
            </AtomButton>
        </div>
        <div class="condition grid grid-cols-7 p-4">
            <div class="filter__wrapper col-span-7 grid grid-cols-1 gap-y-3 gap-x-6 lg:col-span-6 lg:grid-cols-2">
                <slot name="body"></slot>
            </div>
            <div
                v-if="showSearchBtn"
                class="button__wrapper mt-4 col-span-7 flex items-center justify-center lg:col-span-1 lg:mt-0"
            >
                <AtomButton
                    v-if="authRead"
                    @click="clickSearch"
                    :button-name="'btn.search.default'"
                    :class="'w-full lg:w-5/6'"
                    :class-text="'w-full h-12 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75'"
                    :type="'search'"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface SearchBaseProps {
    showSearchBtn?: boolean;
}

import { auth } from '@/plugins/ts/auth';
import AtomButton from '@a/Button.vue';

const { authRead } = auth();

const { showSearchBtn } = withDefaults(defineProps<SearchBaseProps>(), {
    showSearchBtn: true
});

const emit = defineEmits(['click:search']);

function toggle(e: Event) {
    let target = e?.target as HTMLElement;
    target.classList.toggle('bx-minus');
    target.classList.toggle('bx-plus');
    target.closest('div.custom__card')?.querySelector('.condition')?.classList.toggle('hidden');
}

function clickSearch() {
    emit('click:search', 1);
}
</script>
