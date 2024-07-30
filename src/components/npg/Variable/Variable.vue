<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:header>
                <!-- Search -->
                <div :class="cardClass">
                    <SearchVariable :search-data="searchData" :common-code="commonCode" @click:search="goSearch" />
                </div>
                <!-- /Search -->
            </template>
            <template v-slot:body>
                <!-- List -->
                <div :class="cardClass">
                    <CommanderVariable :list-cnt="listCnt" @click:create="goDetail" />
                    <DataListVariable :data-list="reqList" :common-code="commonCode" @click:detail="goDetail" />
                </div>
                <div>
                    <Paging v-if="paging === 'page'" :search-data="searchData" :list-cnt="listCnt"
                        :search-func="goSearch" />
                </div>
                <!-- /List -->
            </template>
        </TemplateBase>
    </div>
    <BasePopup class="z-[200]" :id="detailId" :add-class="'max-w-2xl'" :add-body-class="'p-0'" @close="() => {
            detailInfo = {};
            commonts.hideModal(detailModal);
        }
        ">
        <template v-slot:title>{{ t('voca.variable.details.default') }}</template>
        <template v-slot:msg>
            <VariableDetail :detail-info="detailInfo" :popup-flag="true" :popup-close-func="goSearch" @close="() => {
                    detailInfo = {};
                    commonts.hideModal(detailModal);
                }
                " />
        </template>
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
import type { ListItemType } from '@/types/types';
import TemplateBase from '@o/TemplateBase.vue';
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue';
import VariableDetail from './VariableDetail.vue';
import CommanderVariable from './include/CommanderVariable.vue';
import DataListVariable from './include/DataListVariable.vue';
import SearchVariable from './include/SearchVariable.vue';

import { VariableSearchDTO } from '@cm/types/domain/dto/variable/variableDTO';
const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const cardClass = 'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3';

const detailId = 'VariableDetail';
const detailModal = ref(null as any);

const { stores, gProp, commonts, t } = base();

const { commonCode, paging, compPagePerData } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();
const { dp_data } = datepicker({ type: 'month' });

const docName = 'Variable';

const listCnt = ref(0);
const reqList = ref([] as Array<ListItemType>);

const detailInfo = ref({} as Object);

const searchData = reactive({
    id: '',
    type_cd: '',
    key: '',
    value: '',
    search_from_time: dp_data.dateRangeSearch[0],
    search_to_time: dp_data.dateRangeSearch[1],
    group_name: '',
    status: '',
    create_id: '',
    paging: paging.value,
    page_per_data: compPagePerData.value,
    page: 1,
    sort: 'createTime desc'
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
                reqList.value = [] as Array<ListItemType>;
                getListCnt();
            }
        }
    }
}

function getListCnt() {
    const searchDTO: VariableSearchDTO = {
        id: searchData.id,
        type_cd: searchData.type_cd,
        key: searchData.key,
        value: searchData.value,
        create_time_from: searchData.search_from_time,
        create_time_to: searchData.search_to_time
    };
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;

        gProp?.axios
            .post(commonts.getUrl(gProp, '/variable/cnt'), searchDTO, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
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
    const searchDTO: VariableSearchDTO = {
        id: searchData.id,
        type_cd: searchData.type_cd,
        key: searchData.key,
        value: searchData.value,
        create_time_from: searchData.search_from_time,
        create_time_to: searchData.search_to_time
    };

    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        Object.assign(searchData, commonts.checkSearchData(paging.value, searchData, reqList.value));

        gProp?.axios
            .post(commonts.getUrl(gProp, '/variable/list'), searchDTO, getAxiosOptions('DATA', {}))
            .then((response: any) => {
                if (paging.value === 'scroll' && reqList.value.length > 0) {
                    response?.data.forEach((d: ListItemType) => {
                        reqList.value.push(d);
                    });
                } else {
                    reqList.value = response?.data.variables;
                }

                // paging 처리시 정해진 크기에 맞춰서 데이터 보이도록 부족한 데이터 채움
                pagingFillData(paging.value, reqList.value, searchData);
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function goDetail(data: any) {
    detailInfo.value = data;

    commonts.setDetailInfo(stores, detailInfo.value);
    commonts.showModal(detailModal.value, 200);
}

onBeforeMount(() => {
    goSearch();
    let cmGrpCd = ['CMM100'];
    window.ipcRenderer.send('mng_code_lists', {
        grp_cd: cmGrpCd.join(','),
        use_yn: 'Y',
        sort: 'sort_order asc'
    });
    window.ipcRenderer.once('mng_code_lists_return', (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[key.toLowerCase()] = ret[key]));
    });
});

onMounted(() => {
    detailModal.value = commonts.makeModal(detailId);
    // 초기에만 mounted 될때만 초기화 하면 됨
    commonts.initPage({ docNameId: docName, searchData: searchData }, goSearch);
});

//페이지 떠날 떄, searchData 클리어
onUnmounted(() => {
    stores.common.clearSearchData();
});
</script>
