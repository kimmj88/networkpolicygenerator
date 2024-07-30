<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:header>
                <!-- Search -->
                <div :class="cardClass" class="search-card">
                    <SearchGrpCode :search-data="searchData" :common-code="commonCode" @click:search="goSearch" />
                </div>
                <!-- /Search -->
            </template>
            <template v-slot:body>
                <!-- List -->
                <div :class="cardClass">
                    <CommanderGrpCode
                        :list-cnt="listCnt"
                        @click:excelExport="goExcelExport"
                        @click:excelImport="goExcelImport"
                        @click:create="goDetail"
                    />
                    <DataListGrpCode :data-list="reqList" :common-code="commonCode" @click:detail="goDetail" />
                </div>
                <div>
                    <Paging
                        v-if="paging === 'page'"
                        :search-data="searchData"
                        :list-cnt="listCnt"
                        :search-func="goSearch"
                    />
                </div>
                <!-- /List -->
            </template>
        </TemplateBase>
        <BasePopup
            class="z-[200]"
            :id="detailId"
            :add-class="'max-w-5xl h-fit'"
            :add-body-class="'p-0'"
            @close="
                () => {
                    detailInfo = {};
                    commonts.hideModal(detailModal);
                }
            "
        >
            <template v-slot:title>{{ t('voca.group.code.details.default') }}</template>
            <template v-slot:msg>
                <GrpCodeDetail
                    :detail-info="detailInfo"
                    :popup-flag="true"
                    :popup-close-func="goSearch"
                    @close="
                        () => {
                            detailInfo = {};
                            commonts.hideModal(detailModal);
                        }
                    "
                />
            </template>
        </BasePopup>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import Paging from '@/components/common/layout/Paging.vue';
import GrpCodeDetail from '@/components/common/mng/code/GrpCodeDetail.vue';
import BasePopup from '@/components/common/util/popup/BaseCommon.vue';
import { auth } from '@/plugins/ts/auth';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { fileUpDown } from '@/plugins/ts/fileUpDown';
import TemplateBase from '@o/TemplateBase.vue';
import { onBeforeMount, onMounted, onUnmounted, onUpdated, reactive, ref } from 'vue';
import CommanderGrpCode from './include/CommanderGrpCode.vue';
import DataListGrpCode from './include/DataListGrpCode.vue';
import SearchGrpCode from './include/SearchGrpCode.vue';

const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const cardClass = 'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3';
const labelClassText = 'text-black w-full h-12 text-base font-bold';
const classText = 'text-black w-full h-10 text-base';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';
const btnClassText = 'w-full h-12 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75';

const { stores, gProp, commonts, t } = base();
const { authRead, authCreate, authExcel, authCreateUpdate } = auth();
const { svcType, commonCode, tabIdx, paging, compPagePerData, getDateFormat } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();
const { doExcelExport, goUpload } = fileUpDown();

const docName = 'GrpCode';

const detailId = 'GrpCodeDetail';
const detailModal = ref(null as any);

const listCnt = ref(0);
const reqList = ref([] as any);

const detailInfo = ref({} as any);

const searchData = reactive({
    grp_cd: '',
    grp_cd_nm: '',
    use_yn: 'Y',
    paging: paging.value,
    page_per_data: compPagePerData.value,
    page: 1,
    sort: 'grp_cd asc',
    svc_type: svcType.value
} as any);

// scroll시 bottom 에 도찾하여 처리하는 경우를 위한 변수
const bottomFlag = ref(false);
function setSearchData(data?: number | { [x: string]: any }) {
    if (data !== undefined) {
        if (typeof data === 'number') {
            searchData.page = data;
        } else if (typeof data === 'object') {
            for (const [key, value] of Object.entries(data)) {
                if (key === 'bottomFlag' && typeof value === 'boolean') {
                    bottomFlag.value = value;
                } else {
                    searchData[key] = value;
                }
            }
        }
    }
    //세팅된 searchData store를 통해 localStorage에 저장
    commonts.setSearchData(stores, searchData, docName);
}

function goSearch(data?: number | { [x: string]: any }) {
    bottomFlag.value = false;
    setSearchData(data);

    if (!isAxiosFlag.value) {
        // page 처리인 경우, 최초 로딩시
        if (paging.value === 'page' || reqList.value.length === 0) {
            getListCnt();
        } else if (paging.value === 'scroll') {
            if (bottomFlag.value && listCnt.value > reqList.value.length) {
                // scroll bottom 도착시 로딩이 전체로 다되지 않은 경우 추가 로드
                searchData.page = commonts.getCurrPage(reqList.value.length, searchData) + 1;
                getListCnt();
            } else if (searchData.page === 1 && !bottomFlag.value) {
                // 검색버튼 등 으로 검색시 처리되도록 하기 위해 추가
                reqList.value = [];
                getListCnt();
            }
        }
    }
}

function getListCnt() {
    /**
    // if (!isAxiosFlag.value) {
    //     commonts.debugLog(gProp, [docName, 'getListCnt axios'])
    //     isAxiosFlag.value = true
    //     gProp?.axios
    //         .post(commonts.getUrl(gProp, '/management/code/grpcode/cnt'), searchData, getAxiosOptions('DATA', {}))
    //         .then(function (response: any) {
    //             commonts.debugLog(gProp, response)
    //             listCnt.value = response.data
    //             if (listCnt.value > 0) {
    //                 isAxiosFlag.value = false
    //                 goList()
    //             } else {
    //                 reqList.value = []
    //             }
    //         })
    //         .catch(getErrorFunc)
    //         .finally(getFinallyFunc)
    // }
     */
    if (!isAxiosFlag.value) {
        let channel = 'mng_grp_code_count';
        // DOM, JS 가 아닌 객채를 보내면 electron(ipc) 에서 직렬화 할수 없으므로 객체를 복사해서 보냄
        window.ipcRenderer.send(channel, JSON.parse(JSON.stringify(searchData)));
        window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
            listCnt.value = ret;
            if (listCnt.value > 0) {
                isAxiosFlag.value = false;
                goList();
            } else {
                reqList.value = [];
            }
        });
    }
}

function goList() {
    if (!isAxiosFlag.value) {
        // commonts.debugLog(gProp, [docName, 'goList axios'])
        // isAxiosFlag.value = true
        // Object.assign(searchData, commonts.checkSearchData(paging.value, searchData, reqList.value))
        // gProp?.axios
        //     .post(commonts.getUrl(gProp, '/management/code/grpcode/list'), searchData, getAxiosOptions('DATA', {}))
        //     .then(function (response: any) {
        //         if (paging.value === 'scroll' && reqList.value.length > 0) {
        //             response.data.forEach((d: { [x: string]: any }) => {
        //                 reqList.value.push(d)
        //             })
        //         } else {
        //             reqList.value = response.data
        //         }

        //         // paging 처리시 정해진 크기에 맞춰서 데이터 보이도록 부족한 데이터 채움
        //         pagingFillData(paging.value, reqList.value, searchData)
        //     })
        //     .catch(getErrorFunc)
        //     .finally(getFinallyFunc)

        let channel = 'mng_grp_code_list';
        // DOM, JS 가 아닌 객채를 보내면 electron(ipc) 에서 직렬화 할수 없으므로 객체를 복사해서 보냄
        window.ipcRenderer.send(channel, JSON.parse(JSON.stringify(searchData)));
        window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
            if (paging.value === 'scroll' && reqList.value.length > 0) {
                ret.forEach((d: { [x: string]: any }) => {
                    reqList.value.push(d);
                });
            } else {
                reqList.value = ret;
            }
            // paging 처리시 정해진 크기에 맞춰서 데이터 보이도록 부족한 데이터 채움
            pagingFillData(paging.value, reqList.value, searchData);
        });
    }
}

function goDetail(data?: string | { [x: string]: any }) {
    if (typeof data === 'string') {
        data = {
            id: '',
            // svc_type: svcType.value,
            grp_cd: data,
            grp_cd_nm: '',
            grp_cd_dc: '',
            use_yn: 'Y'
        };
    }
    detailInfo.value = data;
    commonts.setDetailInfo(stores, detailInfo);

    // detail page 별도 사용시 view 및 router URL 추가하고 사용
    // router?.replace({ path: "/cmgrpcode/detail" });
    // commonts.showModal(refCmGrpDetail?.value?.$el);
    commonts.showModal(detailModal.value, 200);
}

function goExcelExport() {
    doExcelExport('/management/code/grpcode/export/excel', searchData);
}

function goExcelImport() {
    goUpload('/management/code/grpcode/import/excel', 'EXCEL_FILE_UPLOAD', goSearch);
}

function nextProcess() {
    // localStorage에 searchData가 저장되어 있는 경우에만 searchData 세팅
    const tempStoredSearchData = stores.common.getSearchData(docName);
    if (tempStoredSearchData) {
        Object.assign(searchData, tempStoredSearchData);
    }
    goSearch();
}

onBeforeMount(() => {
    let grpCds = ['CMM900', 'CMM902'];
    const channel = 'mng_code_lists';
    window.ipcRenderer.send(channel, {
        grp_cd: grpCds.join(','),
        use_yn: 'Y',
        sort: 'sort_order asc'
    });
    window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[key.toLowerCase()] = ret[key]));
    });
});

onMounted(() => {
    nextProcess();
    detailModal.value = commonts.makeModal(detailId);
    commonts.initPage({ docNameId: docName, searchData: searchData }, goSearch);
});

onUpdated(() => {
    commonts.initPage({ docNameId: docName, searchData: searchData }, goSearch);
});

//페이지 떠날 떄, searchData 클리어
onUnmounted(() => {
    stores.common.clearSearchData();
});
</script>
