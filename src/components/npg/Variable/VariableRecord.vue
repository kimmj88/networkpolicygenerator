<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:header>
                <!-- Search -->
                <div :class="cardClass">
                    <SearchKeyGroupRecord
                        :search-data="searchData"
                        :common-code="commonCode"
                        @click:search="goSearch"
                    />
                </div>
                <!-- /Search -->
            </template>
            <template v-slot:body>
                <!-- List -->
                <div :class="cardClass">
                    <CommanderKeyGroupRecord
                        :list-cnt="listCnt"
                        @click:excelExport="goExcelExport"
                        @click:excelImport="goExcelImport"
                        @click:create="goDetail"
                    />
                    <DataListKeyGroupRecord
                        :data-list="reqList"
                        :common-code="commonCode"
                        @click:detail="goDetail"
                        @click:download="doDownload"
                    />
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
    </div>
    <BasePopup
        class="z-[200]"
        :id="detailId"
        :add-class="'max-w-5xl h-fit'"
        :add-body-class="'p-0'"
        @close="closeModal"
    >
        <template v-slot:title>{{ t('voca.key.group.record.details.default') }}</template>
        <template v-slot:msg> </template>
    </BasePopup>
</template>

<script setup lang="ts">
// @ is an alias to /src
import Paging from '@/components/common/layout/Paging.vue';
import BasePopup from '@/components/common/util/popup/BaseCommon.vue';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { datepicker } from '@/plugins/ts/datepicker';
import { fileUpDown } from '@/plugins/ts/fileUpDown';
import type { ListItemType } from '@/types/types';
import TemplateBase from '@o/TemplateBase.vue';
import { saveAs } from 'file-saver';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import CommanderKeyGroupRecord from './include/CommanderKeyGroupRecord.vue';
import DataListKeyGroupRecord from './include/DataListVariableRecord.vue';
import SearchKeyGroupRecord from './include/SearchVariableRecord.vue';

const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const cardClass = 'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3';

const detailId = 'KeyGroupRecordDetail';
const detailModal = ref(null as any);
const goDetail = (data: any) => {
    console.log(data, detailModal.value);
    commonts.showModal(detailModal.value, '29');
};
const closeModal = () => {
    commonts.hideModal(detailModal.value);
};

const { stores, gProp, commonts, t } = base();
const { svcType, commonCode, paging, compPagePerData } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();
const { dp_data } = datepicker({ type: '3month' });
const { doExcelExport, goUpload } = fileUpDown();

const docName = 'KeyGroupRecord';

const listCnt = ref(0);
const reqList = ref([] as Array<ListItemType>);

const searchData = reactive({
    search_from_time: dp_data.dateRangeSearch[0],
    search_to_time: dp_data.dateRangeSearch[1],
    group_name: '',
    emergency_flag: '',
    status: '',
    create_id: '',
    paging: paging.value,
    page_per_data: compPagePerData.value,
    page: 1,
    sort: 'createTime desc',
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
    if (!isAxiosFlag.value) {
        commonts.debugLog(gProp, [docName, 'getListCnt axios']);
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/keygroup/record/cnt'), searchData, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                commonts.debugLog(gProp, response);
                listCnt.value = response?.data?.errorCode === undefined && response?.data ? response?.data : 0;
                if (listCnt.value > 0) {
                    isAxiosFlag.value = false;
                    goList();
                } else {
                    reqList.value = [] as Array<ListItemType>;
                }
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function goList() {
    if (!isAxiosFlag.value) {
        commonts.debugLog(gProp, [docName, 'goList axios']);
        isAxiosFlag.value = true;
        Object.assign(searchData, commonts.checkSearchData(paging.value, searchData, reqList.value));
        gProp?.axios
            .post(commonts.getUrl(gProp, '/keygroup/record/list'), searchData, getAxiosOptions('DATA', {}))
            .then((response: any) => {
                if (paging.value === 'scroll' && reqList.value.length > 0) {
                    response.data.forEach((d: { [x: string]: any }) => {
                        reqList.value.push(d);
                    });
                } else {
                    reqList.value = response.data;
                }

                // paging 처리시 정해진 크기에 맞춰서 데이터 보이도록 부족한 데이터 채움
                pagingFillData(paging.value, reqList.value, searchData);
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function goExcelExport() {
    doExcelExport('/keygroup/record/export/excel', searchData);
}

function goExcelImport() {
    goUpload('/keygroup/record/import/excel', 'EXCEL_FILE_UPLOAD', goSearch);
}
function doDownload(data: any) {
    if (!isAxiosFlag.value) {
        commonts.debugLog(gProp, [docName, 'doDownload axios']);
        isAxiosFlag.value = true;

        gProp?.axios
            .post(commonts.getUrl(gProp, '/keygroup/record/download'), data, getAxiosOptions('FILE'))
            .then(function (response: any) {
                const blob = new Blob([response.data]);
                saveAs(
                    blob,
                    commonts.getFilenameWithHeader(gProp, response?.headers['content-disposition'], 'zip', {
                        flag: false
                    })
                );
                commonts.notificationShow(gProp, 'success', t('msg.info.file.download.default'));
            })
            .catch(() => {
                commonts.notificationShow(gProp, 'error', t('msg.error.info.file.download.default'));
            })
            .finally(getFinallyFunc);
    }
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
    gProp?.axios.all([commonts.getCmCds(gProp, ['CMM102', 'CMM104', 'CMM900'], '')]).then(
        gProp?.axios.spread((cmmList: { [x: string]: Array<{ [x: string]: any }> }) => {
            Object.keys(cmmList).forEach((key: string) => (commonCode[key.toLowerCase()] = cmmList[key]));
            nextProcess();
        })
    );
});

onMounted(() => {
    detailModal.value = commonts.makeModal(detailId);
    // 초기에만 mounted 될때만 초기화 하면 됨
    commonts.initPage({ docNameId: docName, searchData: searchData }, goSearch);
});
</script>
