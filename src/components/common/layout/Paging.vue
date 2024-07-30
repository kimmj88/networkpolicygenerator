<template>
    <!-- <div v-if="pageNavi > 1 && authRead"> -->
    <div class="pagination-content" v-if="listCnt > pagingData.page_per_data">
        <ul class="pagination">
            <li class="page-per-data">
                <span>{{ t('voca.page.per.data.default') }}</span>
                <v-select
                    class="page-select rounded single p-0 max-w-max ml-3"
                    v-model="pagingData.page_per_data"
                    :value="pagingData.page_per_data"
                    @update:modelValue="goToPage(1)"
                    :options="commonCode?.cmm900"
                    :get-option-label="(option: any) => Number(option?.cm_cd)"
                    :reduce="(option: any) => Number(option?.cm_cd)"
                    :tabindex="tabIdx.paging + 0"
                    :clearable="false"
                    :placeholder="t('msg.info.select.default')"
                    menu-props="auto"
                >
                    <template #no-options>{{ t('msg.error.info.data.not_exist.default') }}</template>
                </v-select>
            </li>
            <li>
                <span class="page-info">
                    {{ pageInfoMsg }}
                </span>
            </li>
            <li v-if="pagingData.page > 1" :class="'cursor-pointer ic_left'" @click="goToPage('l')"></li>
            <li v-else class="ic_left_gray" disabled="disabled"></li>
            <li v-if="pagingData.page < pageNavi" :class="'cursor-pointer ic_right'" @click="goToPage('r')"></li>
            <li v-else class="ic_right_gray" disabled="disabled"></li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { computed, onBeforeMount, reactive } from 'vue';

const props = defineProps({
    listCnt: {
        type: Number,
        default: 0
    },
    searchData: Object,
    searchFunc: Function,
    popupFlag: {
        type: Boolean,
        default: false
    }
});

const { gProp, commonts, t } = base();

const { tabIdx, paging, compPagePerData } = commonVar();

const pagingData = reactive(
    props.searchData ?? {
        paging: paging.value,
        page: 1,
        page_per_data: compPagePerData.value
    }
);

const commonCode = reactive({} as any);

const listCnt = computed(() => props.listCnt);

const pageNavi = computed(() => commonts.getPageNavi(props));

const pageInfoMsg = computed(() => {
    return t('voca.page.argv.entire.default', [1, pageNavi.value, pagingData.page]);
});

function goToPage(page: number | string) {
    if (gProp !== undefined) {
        // page 이동 처리
        if (page === 'l') {
            if (pagingData.page > 1) {
                pagingData.page = pagingData.page - 1;
            } else {
                pagingData.page = 1;
            }
        } else if (page === 'r') {
            if (pagingData.page < pageNavi.value) {
                pagingData.page += 1;
            } else {
                pagingData.page = pageNavi.value;
            }
        } else {
            pagingData.page = page;
        }

        // 전역 변수에 현재 페이지 정보 저장
        gProp.$pageInfo.page = pagingData.page;
        gProp.$pageInfo.page_per_data = pagingData.page_per_data;

        // page 이동 처리
        if (props.searchFunc !== undefined) props.searchFunc(pagingData);
        setTimeout(setPositionContext, 1000);
    }
}

function setPositionContext() {
    let target = document.querySelector('.pagination-content');
    let paginationDiv = target?.parentNode as HTMLElement;

    let wrapperHeight = (document.querySelector('.content-wrapper') as HTMLElement)?.offsetHeight;
    let contentHeight = (document.querySelector('.main-content') as HTMLElement)?.offsetHeight;
    if (wrapperHeight - contentHeight <= 300) {
        paginationDiv?.classList?.add('v-select-up');
    } else {
        paginationDiv?.classList?.remove('v-select-up');
    }
}

function deDupCdArr(dupArr: Array<any>) {
    const uniqueArr = [] as any;
    dupArr.forEach((e1: any) => {
        let flag = true;
        uniqueArr.forEach((e2: any) => {
            if (e1?.cm_cd === e2?.cm_cd) {
                flag = false;
                return flag;
            }
        });
        if (flag) uniqueArr.push(e1);
    });
    return uniqueArr;
}

function nextProcess() {
    setTimeout(setPositionContext, 500);
}

onBeforeMount(() => {
    // gProp?.axios.all([commonts.getCmCds(gProp, ["CMM900"], "")]).then(
    // 	gProp?.axios.spread((cmmList: { [x: string]: Array<{ [x: string]: any }> }) => {
    // 		Object.keys(cmmList).forEach((key: string) => (commonCode[key.toLowerCase()] = deDupCdArr(cmmList[key])));
    // 		nextProcess();
    // 	})
    // );

    let grpCds = ['CMM900'];
    const channel = 'mng_code_lists';
    window.ipcRenderer.send(channel, {
        grp_cd: grpCds.join(','),
        use_yn: 'Y',
        sort: 'sort_order asc'
    });
    window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[key.toLowerCase()] = ret[key]));
        nextProcess();
    });
});
</script>
