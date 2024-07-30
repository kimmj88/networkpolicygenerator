<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:header>
                <!-- Search -->
                <div :class="cardClass">
                    <SearchRule :search-data="searchData" :common-code="commonCode" @click:search="goSearch" />
                </div>
                <!-- /Search -->
            </template>
            <template v-slot:body>
                <!-- List -->
                <div :class="cardClass">
                    <CommanderRule
                        :list-cnt="listCnt"
                        @click:excelExport="goExcelExport"
                        @click:excelImport="goExcelImport"
                        @click:create="goDetail"
                    />
                    <DataListRule
                        :data-list="reqList"
                        :common-code="commonCode"
                        @click:detail="goDetail"
                        @click:execute="goExecute"
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
</template>

<script setup lang="ts">
// @ is an alias to /src
import Paging from '@/components/common/layout/Paging.vue';
import CommanderRule from '@/components/npg/rule/rule/include/CommanderRule.vue';
import SearchRule from '@/components/npg/rule/rule/include/SearchRule.vue';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { datepicker } from '@/plugins/ts/datepicker';
import { fileUpDown } from '@/plugins/ts/fileUpDown';
import { ruleStore } from '@/stores/modules/Rule';
import type { ListItemType } from '@/types/types';
import { IRuleDTO, ISearchRuleDTO } from '@cm/types/domain/dto/rule/ruleDTO';
import TemplateBase from '@o/TemplateBase.vue';
import { onBeforeMount, onMounted, onUnmounted, onUpdated, reactive, ref } from 'vue';
import DataListRule from './include/DataListRule.vue';

const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const cardClass = 'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3';

const detailId = 'Rule';
const detailModal = ref(null as any);

const { stores, gProp, commonts, t, router } = base();

const { commonCode, paging, compPagePerData } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();
const { dp_data } = datepicker({ type: 'year' });
const { doExcelExport, goUpload } = fileUpDown();

const docName = 'KeyGroup';

const listCnt = ref(0);
const reqList = ref([] as Array<ListItemType>);

const searchData = reactive<ISearchRuleDTO>({
    title: '',
    action: '',
    protocol: '',
    source_address: '',
    source_port: '',
    direction_operator: '',
    dest_address: '',
    dest_port: '',
    create_time_from: dp_data.dateRangeSearch[0],
    create_time_to: dp_data.dateRangeSearch[1],
    paging: paging.value,
    page_per_data: compPagePerData.value,
    page: 1,
    sort: 'createTime desc'
});

// scroll시 bottom 에 도찾하여 처리하는 경우를 위한 변수
const bottomFlag = ref(false);

function setSearchData<ISearchRuleDTO>(data?: number | { [key: string]: any }) {
    if (data !== undefined || data !== null) {
        if (typeof data === 'number') {
            searchData.page = data;
        } else if (typeof data === 'object') {
            for (const [key, value] of Object.entries(data)) {
                if (key === 'bottomFlag' && typeof value === 'boolean') {
                    bottomFlag.value = value;
                } else {
                    (searchData as ISearchRuleDTO)[key as keyof ISearchRuleDTO] = value; // Type assertion
                }
            }
        }
    }
    //세팅된 searchData store를 통해 localStorage에 저장
    commonts.setSearchData(stores, searchData, docName);
}

function goSearch(data?: number | ISearchRuleDTO) {
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
                reqList.value = [] as Array<ListItemType>;
                getListCnt();
            }
        }
    }
}

function getListCnt() {
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/rule/cnt'), searchData, getAxiosOptions('DATA', {}))
            // .post(commonts.getUrl(gProp, '/rule/count'), searchData, getAxiosOptions('DATA', {}))
            .then(function ({ data }: any) {
                listCnt.value = data.result ? data?.data : 0;

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
            .post(commonts.getUrl(gProp, '/rule/list'), searchData, getAxiosOptions('DATA', {}))
            // .post(commonts.getUrl(gProp, '/keygroup/group/list'), searchData, getAxiosOptions('DATA', {}))
            .then(({ data }: any) => {
                const ruleRow = data.data as IRuleDTO[];
                if (paging.value === 'scroll' && reqList.value.length > 0) {
                    ruleRow.forEach((row) => {
                        const parsedRule = spreadRule(row);
                        reqList.value.push(parsedRule);
                    });
                } else {
                    const parsedRows = ruleRow.map((row) => spreadRule(row));
                    reqList.value = parsedRows;
                }
                // paging 처리시 정해진 크기에 맞춰서 데이터 보이도록 부족한 데이터 채움
                pagingFillData(paging.value, reqList.value, searchData);
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function goDetail(data: any) {
    const selectedItemId = data.id;
    ruleStore.id = selectedItemId;
    router?.push('/npg/rule/rule/detail');
}

function goExecute(data: any) {
    commonts.debugLog(gProp, ['goExecute', data]);
    if (!isAxiosFlag.value) {
        commonts.debugLog(gProp, [docName, 'goExecute axios']);
        isAxiosFlag.value = true;
        data.keys_search = {
            id: '',
            key_group_id: data.id,
            paging: 10,
            page_per_data: 9999,
            page: 1,
            sort: 'createTime desc'
        };

        gProp?.axios
            .post(commonts.getUrl(gProp, '/keygroup/group/run'), data, getAxiosOptions('DATA', {}))
            .then(() => {
                commonts.notificationShow(gProp, 'success', t('msg.info.run.default'));
            })
            .catch(function (error: any) {
                commonts.debugLog(gProp, error);
                commonts.notificationShow(gProp, 'error', t('msg.error.info.run.default'));
            })
            .finally(getFinallyFunc);
    }
}

function goExcelExport() {
    doExcelExport('/keygroup/group/export/excel', searchData);
}

function goExcelImport() {
    goUpload('/keygroup/group/import/excel', 'EXCEL_FILE_UPLOAD', goSearch);
}

function nextProcess() {
    // localStorage에 searchData가 저장되어 있는 경우에만 searchData 세팅
    // const tempStoredSearchData = stores.common.getSearchData(docName);
    // if (tempStoredSearchData) {
    //     Object.assign(searchData, tempStoredSearchData);
    // }
    // console.log('nextProcess =======> ', tempStoredSearchData, searchData);
    //처음에는 페이지 0 조회
    goSearch(0);
}

function spreadRule(ruleRow: IRuleDTO) {
    const { rule_header, rule_payload, rule_non_payload, rule_detection_filter, ...rule_base } = ruleRow;
    const { id: rule_header_id, ...rule_header_without_id } = rule_header || {};
    const { id: rule_payload_id, ...rule_payload_without_id } = rule_payload || {};
    const { id: rule_non_payload_id, ...rule_non_payload_without_id } = rule_non_payload || {};
    const { id: rule_detection_filter_id, ...rule_detection_filter_without_id } = rule_detection_filter || {};

    const parsedRule = {
        ...rule_base,
        ...rule_header_without_id,
        ...rule_payload_without_id,
        ...rule_non_payload_without_id,
        ...rule_detection_filter_without_id
    };

    return parsedRule;
}

onBeforeMount(() => {
    let grpCds = ['CMM001', 'CMM200', 'CMM201', 'CMM202', 'CMM901', 'CMM902'];
    const channel = 'mng_code_lists';
    window.ipcRenderer.send(channel, {
        grp_cd: grpCds.join(','),
        use_yn: 'Y',
        sort: 'sort_order asc'
    });
    // list 화면에 popup으로 detail이 들어가는 경우 코드 리스트 조회 ipc 세팅시 detail 쪽은 once 대신 on 으로 세팅한다
    window.ipcRenderer.on([channel, 'return'].join('_'), (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[key.toLowerCase()] = ret[key]));
        nextProcess();
    });
});

onMounted(() => {
    detailModal.value = commonts.makeModal(detailId);
    // 초기에만 mounted 될때만 초기화 하면 됨
    commonts.initPage({ docNameId: docName, searchData: searchData }, goSearch);
});

onUpdated(() => {});

//페이지 떠날 떄, searchData 클리어
onUnmounted(() => {
    stores.common.clearSearchData();
});
</script>
