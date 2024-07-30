<template>
    <div class="flex items-center justify-between p-3">
        <div class="label h-12 inline-flex items-center"></div>
        <div class="commandBtn flex items-end justify-items-end">
            <AtomButton
                :type="'save'"
                :class="btnClass"
                :class-text="classText"
                :button-name="'btn.save.default'"
                @click="clickSave"
            />
            <AtomButton
                v-if="!isNew"
                :type="'delete'"
                :class="btnClass"
                :class-text="classText"
                :button-name="'btn.delete.default'"
                @click="clickDelete"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import AtomButton from '@a/Button.vue';

const classText = 'w-full h-12 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';

const props = defineProps({
    isNew: {
        type: Boolean,
        default: true
    },
    popupFlag: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['click:save', 'click:delete', 'click:list']);
const clickSave = (e: MouseEvent) => {
    emit('click:save', e);
};
const clickDelete = (e: MouseEvent) => {
    emit('click:delete', e);
};
</script>
