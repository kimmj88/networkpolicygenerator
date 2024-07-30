<template>
    <div class="flex items-center justify-between p-3">
        <div class="label h-12 inline-flex items-center"></div>
        <div class="commandBtn flex items-end justify-items-end">
            <AtomButton
                v-if="authCreateUpdate"
                :type="'save'"
                :class="btnClass"
                :class-text="classText"
                :button-name="'btn.save.default'"
                @click="clickSave"
            />
            <AtomButton
                v-if="authDelete && detailId !== '' && detailId !== null && detailId !== undefined"
                :type="'delete'"
                :class="btnClass"
                :class-text="classText"
                :button-name="'btn.delete.default'"
                @click="clickDelete"
            />
            <AtomButton
                v-if="!popupFlag"
                :type="'list'"
                :class="btnClass"
                :class-text="classText + ' bxc bxc-list-ul'"
                :button-name="'btn.list.default'"
                @click="clickList"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { auth } from '@/plugins/ts/auth';
import AtomButton from '@a/Button.vue';

// 권한에 따라 처리해야하는 경우
const { authDelete, authCreateUpdate } = auth();

const classText = 'w-full h-12 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';

const props = defineProps({
    detailId: {
        type: [String, Number],
        default: ''
    },
    popupFlag: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['click:save', 'click:delete', 'click:list']);
const clickSave = (e: MouseEvent) => {
    console.log('click save');
    emit('click:save', e);
};
const clickDelete = (e: MouseEvent) => {
    console.log('click delete');
    emit('click:delete', e);
};
const clickList = (e: MouseEvent) => {
    console.log('click list');
    emit('click:list', e);
};
</script>
