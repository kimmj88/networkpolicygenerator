<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:header>
                <!-- Search -->
                <div :class="cardClass">
                    <SearchPolicy :search-data="searchData" :common-code="commonCode" @click:search="goSearch" />
                </div>
                <!-- /Search -->
            </template>
            <template v-slot:body>
                <!-- List -->
                <div :class="cardClass">
                    <CommanderPolicy :list-cnt="policyCnt?.cnt" @click:create="goDetail" />
                    <DataListPolicy
                        :data-list="policyList.policies"
                        :common-code="commonCode"
                        @click:detail="goDetail"
                        @click:export="onClickedExport"
                    />
                </div>
                <div>
                    <Paging
                        v-if="paging === 'page'"
                        :search-data="searchData"
                        :list-cnt="policyCnt?.cnt"
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
        :add-class="'max-w-6xl'"
        :add-body-class="'p-0'"
        @close="
            () => {
                detailInfo = {};
                commonts.hideModal(detailModal);
            }
        "
    >
        <template v-slot:title>{{ t('voca.policy.details.default') }}</template>
        <template v-slot:msg>
            <PolicyDetail
                :detail-info="detailInfo"
                :popup-flag="true"
                :popup-close-func="goSearch"
                :common-code="commonCode"
                @close="
                    () => {
                        detailInfo = {};
                        commonts.hideModal(detailModal);
                        goSearch();
                    }
                "
            />
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
import TemplateBase from '@o/TemplateBase.vue';
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue';
import PolicyDetail from './PolicyDetail.vue';
import CommanderPolicy from './include/CommanderPolicy.vue';
import DataListPolicy from './include/DataListPolicy.vue';
import SearchPolicy from './include/SearchPolicy.vue';

import { PolicyExportDTO, PolicySearchDTO } from '@cm/types/domain/dto/policy/policyDTO';
import { ModuleDTO } from '@cm/types/domain/dto/module/moduleDTO';
const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

import { ResponseCountPolicy, ResponseLoadPolicy } from '@cm/types/domain/apis/policy/policy';
import {PolicyDTO} from '@cm/types/domain/dto/policy/policyDTO'

const cardClass = 'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3';

const detailId = 'PolicyDetail';
const detailModal = ref(null as any);

const { stores, gProp, commonts, t } = base();

const { svcType, commonCode, paging, compPagePerData } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();
const { dp_data } = datepicker({ type: 'month' });

const docName = 'Policy';

const policyCnt = ref<ResponseCountPolicy>({
    cnt: 0,
    result: false,
    message: ''
});

const policyList = ref<ResponseLoadPolicy>({
    policies: [],
    result: false
});

const detailInfo = ref({} as Object);

const searchData = reactive({
    id: '',
    title: '',
    policyModules: [],
    search_from_time: dp_data.dateRangeSearch[0],
    search_to_time: dp_data.dateRangeSearch[1],
    group_name: '',
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
        if (paging.value === 'page' || policyList.value.policies.length === 0) {
            getListCnt();
        } else if (paging.value === 'scroll') {
            if (bottomFlag.value && policyCnt.value!.cnt > policyList.value.policies.length) {
                // scroll bottom 도착시 로딩이 전체로 다되지 않은 경우 추가 로드
                searchData.page = commonts.getCurrPage(policyList.value.policies.length, searchData) + 1;
                getListCnt();
            } else if (searchData.page === 1 && !bottomFlag.value) {
                // 검색버튼 등 으로 검색시 처리되도록 하기 위해 추가
                policyList.value.policies = [];
                getListCnt();
            }
        }
    }
}

function getListCnt() {
    const searchDTO: PolicySearchDTO = {
        id: searchData.id,
        title: searchData.title,
        create_time_from: searchData.search_from_time,
        create_time_to: searchData.search_to_time
    };
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/policy/cnt'), searchDTO, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                if (response.data.cnt > 0) {
                    policyCnt.value = response.data;
                    isAxiosFlag.value = false;
                    goList();
                } else {
                    policyList.value.policies = [];
                }
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function goList() {
    const searchDTO: PolicySearchDTO = {
        id: searchData.id,
        title: searchData.title,
        create_time_from: searchData.search_from_time,
        create_time_to: searchData.search_to_time
    };

    if (!isAxiosFlag.value) {
        commonts.debugLog(gProp, [docName, 'goList axios']);
        isAxiosFlag.value = true;
        Object.assign(searchData, commonts.checkSearchData(paging.value, searchData, policyList.value.policies));

        gProp?.axios
            .post(commonts.getUrl(gProp, '/policy/list'), searchDTO, getAxiosOptions('DATA', {}))
            .then((response: any) => {
                if (paging.value === 'scroll' && policyList.value.policies.length > 0) {
                    response?.data.forEach((d: PolicyDTO) => {
                        policyList.value.policies.push(d);
                    });
                } else {
                    policyList.value = response?.data;
                }

                pagingFillData(paging.value, policyList.value.policies, searchData);
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function goDetail(data: any) {
    detailInfo.value = {
        ...data,
        //moduleList : moduleList_test.value,
        policyModules: data?.policyModules?.reduce((res: any, item: ModuleDTO) => {
            res[item.type_cd as keyof ModuleDTO] = item;
            return res;
        }, {})
    };

    commonts.setDetailInfo(stores, detailInfo.value);
    commonts.showModal(detailModal.value, 200);
}

async function onClickedExport(data: any) {
    const result = await window.electron.selectDirectory();
    if (result && result.length > 0) {
        data.selectedFolder = result[0];
        const exportDTO: PolicyExportDTO = {
            policyTitle: data.title,
            selectedFolderPath: (data.selectedFolder = result[0]),
            modules: data.policyModules,
            modulePrevObj: undefined,
            variablePreview: '',
            allowlist: [],
            blocklist: [],
            rulesList: undefined
        };
        if (!isAxiosFlag.value) {
            isAxiosFlag.value = true;

            gProp?.axios
                .post(commonts.getUrl(gProp, '/policy/export'), exportDTO, getAxiosOptions('DATA', {}))
                .then(() => {
                    commonts.notificationShow(gProp, 'success', t('msg.info.export.default'));
                })
                .catch(function (error: any) {
                    commonts.notificationShow(gProp, 'error', t('msg.error.info.export.default'));
                })
                .finally(getFinallyFunc);
        }
    }
}

onBeforeMount(() => {
    let cmGrpCd = ['CMM100', 'CMM300', 'CMM301', 'CMM302', 'CMM303', 'CMM304', 'CMM305'];
    window.ipcRenderer.send('mng_code_lists', {
        grp_cd: cmGrpCd.join(','),
        use_yn: 'Y',
        sort: 'sort_order asc'
    });

    window.ipcRenderer.once('mng_code_lists_return', (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[key.toLowerCase()] = ret[key]));
        //loadPolicyModule();
        goSearch();
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

<style>

</style>