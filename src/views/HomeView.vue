<template>
    <div id="home" class="w-full h-full content-bg inline-flex items-center justify-center">
        <div>
            <img v-if="ci === 'kl'" src="@/assets/img/BI_AutoCryptKeyLink.png" alt="AutoCrypt" />
            <img v-else class="p-auto" src="@/assets/img/main_logo_autocrypt.png" alt="AutoCryptPKI" />
        </div>
        <div v-if="devMode" class="ml-3">
            <div :class="devModeClass">
                <AtomButton :button-name="'Open Modal Comp.'" :type="'search'" @click="openModal" />
                <AtomButton
                    :button-name="'Open Confirm YN'"
                    :type="'create'"
                    @click="openConfirm('Confirm YN', '테스트입니다', 'YN')"
                />
                <AtomButton
                    :button-name="'Open Confirm Y'"
                    :type="'delete'"
                    @click="openConfirm('Confirm Y', '테스트입니다', 'Y')"
                />
                <AtomButton :button-name="'Open Confirm N'" @click="openConfirm('Confirm N', '테스트입니다', 'N')" />
            </div>
            <div :class="devModeClass">
                <AtomButton
                    :button-name="'Success notification'"
                    :type="'custom'"
                    :class-text="'w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:ring'"
                    @click="onClickSuccess"
                />
                <AtomButton
                    :button-name="'Info notification'"
                    :type="'custom'"
                    :class-text="'w-full px-4 py-2 font-bold text-white bg-yellow-500 rounded hover:bg-yellow-600 focus:outline-none focus:ring'"
                    @click="onClickInfo"
                />
                <AtomButton
                    :button-name="'Error notification'"
                    :type="'custom'"
                    :class-text="'w-full px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring'"
                    @click="onClickError"
                />
            </div>
            <div class="v-select-out-card" :class="devModeClass">
                <Paging
                    v-if="paging === 'page'"
                    :list-cnt="listCnt"
                    :page-per-data="pagePerData"
                    :search-func="goSearch"
                />
            </div>
            <div :class="devModeClass">
                <AtomButton :button-name="'openWindow'" :type="'create'" @click="openWindow" />
                <AtomButton :button-name="'Clock Stop'" :type="'delete'" @click="stopClock" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Paging from '@/components/common/layout/Paging.vue';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { fileUpDown } from '@/plugins/ts/fileUpDown';
import AtomButton from '@a/Button.vue';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted } from 'vue';

const { commonts, stores, emitter, gProp } = base();
const { ci, paging, devMode, gnbPosition } = commonVar();
const { goUpload } = fileUpDown();

const listCnt = 5;
const pagePerData = 10;

const devModeClass = computed(() => {
    return gnbPosition ? 'grid grid-cols-2 gap-2 mt-2' : 'grid grid-cols-4 gap-2 mt-2';
});

const openModal = () => {
    commonts.debugLog(gProp, 'home openModal');
    goUpload('', 'FILE_UPLOAD');
};

const openConfirm = (title: string, msg: string, method: string) => {
    commonts.debugLog(gProp, 'home openConfirm');
    emitter.emit('openConfirm', { title, msg, method });
};

const goSearch = () => {
    commonts.debugLog(gProp, 'home goSearch function');
};

const stopClock = () => {
    emitter.emit('clockStop');
};

const onClickSuccess = () => {
    gProp?.$commonts.notificationShow(gProp, 'success', 'Success Test', -1);
};
const onClickInfo = () => {
    gProp?.$commonts.notificationShow(gProp, 'information', 'Info Test', -1);
};
const onClickError = () => {
    gProp?.$commonts.notificationShow(gProp, 'error', 'Error Test', 7000);
};

const openWindow = () => {
    window.open('/', '', '_blank');
};

emitter.on('get-confirm-flag', (flag: boolean) => {
    commonts.debugLog(gProp, 'get-confirm-flag -> ' + flag);
});

onBeforeMount(() => {
    let lsIsAuthenticated = localStorage?.getItem('isAuthenticated') === 'true';
    let isAuthenticated =
        stores.common.isAuthenticated === !lsIsAuthenticated ? lsIsAuthenticated : stores.common.isAuthenticated;
    emitter.emit('view-flag', { header: isAuthenticated, footer: isAuthenticated });
});

onMounted(() => {
    commonts.debugLog(gProp, 'home');
    commonts.hideLoading();
});

onBeforeUnmount(() => {});

onUnmounted(() => {
    emitter.off('get-confirm-flag');
});
</script>
