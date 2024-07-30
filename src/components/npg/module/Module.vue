<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:header>
                <!-- Search -->
                <div :class="cardClass">
                    <SearchModule :search-data="searchData" :common-code="commonCode"
                        @click:search.once="() => executeSearch()" :key="searchKey" />
                </div>
                <!-- /Search -->
            </template>
            <template v-slot:body>
                <!-- List -->
                <div :class="cardClass">
                    <CommanderModule :list-cnt="listCnt" @click:create="onClickedCreate" />
                    <DataListModule :data-list="reqList" :common-code="commonCode" @click:detail="onClickedDetail" />
                </div>
                <div>
                    <Paging v-if="paging === 'page'" :search-data="searchData" :list-cnt="listCnt"
                        :search-func="() => executeSearch()" />
                </div>
                <!-- /List -->
            </template>
        </TemplateBase>
    </div>
    <BasePopup index="200" :id="detailId" :add-class="'max-w-5xl h-fit'" :add-body-class="'p-0'" @close="onClosedPopup"
        :is-show="isPopupVisible">
        <template v-slot:title>{{ t('voca.module.details.default') }}</template>
        <template v-slot:msg>
            <ModuleDetail :detail-info="detailInfo" :popup-flag="true" @close="onClosedPopup" />
        </template>
    </BasePopup>
</template>

<script setup lang="ts">
import Paging from '@/components/common/layout/Paging.vue';
import BasePopup from '@/components/common/util/popup/BasePopup.vue';
import ModuleDetail from '@/components/npg/module/ModuleDetail.vue';
import CommanderModule from '@/components/npg/module/include/CommanderModule.vue';
import DataListModule from '@/components/npg/module/include/DataListModule.vue';
import SearchModule from '@/components/npg/module/include/SearchModule.vue';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { datepicker } from '@/plugins/ts/datepicker';
import { useCodeStore } from '@/stores/useCodeStore';
import { ListItemType } from '@/types/types';
import { ReqCountModule, ReqSearchModule, ResCountModule, ResSearchModule } from '@cm/types/domain/apis/module/module';
import { requestManager } from '@cm/types/domain/apis/common';

import { ModuleDTO, SearchModuleDTO } from '@cm/types/domain/dto/module/moduleDTO';
import TemplateBase from '@o/TemplateBase.vue';
import { onBeforeMount, onMounted, ref } from 'vue';

const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const docName = 'Module';
const detailId = 'ModuleDetail';

//#region define classes
const cardClass = 'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3';
//#endregion

const { commonCode, paging, compPagePerData } = commonVar({
    props: props,
    searchFunc: onScrollEnd
});

const { gProp, commonts, t } = base();
const { pagingFillData } = axios();
const codeStore = useCodeStore();

const { dp_data } = datepicker({ type: 'month' });

const listCnt = ref<number>(0);
const reqList = ref<ListItemType[]>([]);
const detailInfo = ref<ModuleDTO>({});
const isPopupVisible = ref<boolean>(false);

const searchKey = ref<number>(0);

const searchData = ref<SearchModuleDTO>({
    create_time_from: dp_data.dateRangeSearch[0],
    create_time_to: dp_data.dateRangeSearch[1],
    page: 1,
    page_per_data: compPagePerData.value,
    paging: paging.value,
    sort: 'createTime desc',
    title: '',
    type_cd: ''
});

//#region events

onBeforeMount(() => {
    codeStore.get({
        codeKeys: ['CMM300']
    }).then((res) => {
        Object.keys(res).forEach((key: string) => (commonCode[key.toLowerCase()] = res[key]));
        requestCount();
    });
});

onMounted(() => {
    commonts.initPage({ docNameId: docName, searchData: searchData.value });
});

//#endregion

//#region functions

function setSearchData(data: { [x: string]: any }) {
    for (const [key, value] of Object.entries(data)) {
        searchData.value[key as keyof SearchModuleDTO] = value;
    }
}

function executeSearch(data?: { [x: string]: any }) {
    if (data) {
        setSearchData(data);
    }

    if (searchData.value.page === 1) {
        reqList.value = [];
        requestCount();
    } else {
        searchKey.value++;
    }
}

function requestCount() {
    requestManager.call<ReqCountModule, ResCountModule>(commonts.getUrl(gProp, '/module/cnt'), {
        data: searchData.value
    }).then((res) => {
        if (res.status == 200) {
            if (res.data) {
                listCnt.value = res.data.count;
                if (listCnt.value > 0) {
                    requestList();
                } else {
                    reqList.value = [];
                }
            }
        }
    }).catch(() => {
        searchKey.value++;
    });
}

function requestList() {
    requestManager.call<ReqSearchModule, ResSearchModule>(commonts.getUrl(gProp, '/module/list'), {
        data: searchData.value,
    }).then((res) => {
        if (paging.value === 'scroll' && reqList.value.length > 0) {
            res.data.modules.forEach((module: ModuleDTO) => {
                reqList.value.push(module);
            });
        } else {
            reqList.value = res.data.modules;
        }
        // paging 처리시 정해진 크기에 맞춰서 데이터 보이도록 부족한 데이터 채움
        pagingFillData(paging.value, reqList.value, searchData.value);
    }).finally(() => {
        searchKey.value++;
    });
}

function onScrollEnd(option: {
    bottomFlag: boolean
}) {
    if (reqList.value.length > 0 && (listCnt.value > reqList.value.length)) {
        searchData.value.page = commonts.getCurrPage(reqList.value.length, searchData.value) + 1;
        requestCount();
    }
}

function onClickedCreate() {
    detailInfo.value = {};
    isPopupVisible.value = true;
}

function onClickedDetail(data: ModuleDTO) {
    if (data) {
        detailInfo.value = {
            id: data.id,
            title: data.title,
            type_cd: data.type_cd,
            module_value_list: data.module_value_list
        };
    }
    isPopupVisible.value = true;
}

function onClosedPopup() {
    isPopupVisible.value = false;

    searchData.value.page = 1;
    reqList.value = [];

    requestCount();
}

//#endregion
</script>
