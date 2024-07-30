<template>
    <div class="flex items-center justify-between p-3">
        <div class="label h-12 inline-flex items-center">
            <AtomLabel :class-text="labelClassText" :label-text="t('voca.count.argv.default', [props.listCnt])" />
        </div>
        <div class="commandBtn flex items-end justify-items-end">
            <AtomButton :type="'create'" :class="btnClass" :class-text="classText" :button-name="'btn.create.default'"
                @click="onClickedCreate($event)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import AtomButton from '@a/Button.vue';
import AtomLabel from '@a/Label.vue';

const { t } = base();

const labelClassText = 'text-black w-full h-12 text-base';
const classText = 'w-full h-12 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';

const props = defineProps({
    listCnt: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['click:create']);

const onClickedCreate = (e: Event) => {
    emit('click:create', null);
};
</script>
