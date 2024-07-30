<template>
    <div class="flex items-center justify-between p-3">
        <div class="label h-12 inline-flex items-center">
            <AtomLabel :class-text="labelClassText" :label-text="t('voca.count.argv.default', [count])" />
        </div>
        <div class="commandBtn flex items-end justify-items-end">
            <AtomButton
                v-if="authExcel && count > 0"
                :type="'export'"
                :class="btnClass + ' w-[10rem]'"
                :class-text="classText + ' bxc bxc-download'"
                :button-name="'btn.excel.download.default'"
                @click="doExcelExport($event)"
            />
            <AtomButton
                v-if="false && authCreateUpdate && authExcel"
                :type="'import'"
                :class="btnClass + ' w-[10rem]'"
                :class-text="classText + ' bxc bxc-upload'"
                :button-name="'btn.excel.upload.default'"
                @click="doExcelImport($event)"
            />
            <AtomButton
                v-if="authCreateUpdate"
                :type="'create'"
                :class="btnClass"
                :class-text="classText"
                :button-name="'btn.create.default'"
                @click="doCreate"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { auth } from '@/plugins/ts/auth';
import { base } from '@/plugins/ts/base';
import AtomButton from '@a/Button.vue';
import AtomLabel from '@a/Label.vue';
import { computed, onBeforeMount } from 'vue';

// 권한에 따라 처리해야하는 경우

const { t } = base();
const { authRead, authExcel, authCreateUpdate } = auth();

const labelClassText = 'text-black w-full h-12 text-base';
const classText = 'w-full h-12 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';

const props = defineProps({
    listCnt: {
        type: Number,
        default: 0
    }
});

const count = computed(() => {
    return authRead ? props.listCnt : 0;
});

const emit = defineEmits(['click:create', 'click:excelExport', 'click:excelImport']);
const doExcelExport = (e: MouseEvent) => {
    emit('click:excelExport', e);
};
const doExcelImport = (e: MouseEvent) => {
    emit('click:excelImport', e);
};
const doCreate = () => {
    emit('click:create', '');
};

onBeforeMount(() => {});
</script>
