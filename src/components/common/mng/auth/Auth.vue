<template>
    <div :id="docName">
        <div>
            <!-- Search -->
            <div :class="cardClass">
                <SearchBase @click:search="goSearch(1)">
                    <template v-slot:body>
                        <MoleInput
                            :label-class-text="labelClassText"
                            :label-text="t('voca.auth.id.default')"
                            :class-text="classText"
                            v-model="searchData.auth_id"
                            @keyup.enter="goSearch(1)"
                            :tabindex="tabIdx.lstIn"
                        />
                        <MoleInput
                            :label-class-text="labelClassText"
                            :label-text="t('voca.auth.name.default')"
                            :class-text="classText"
                            v-model="searchData.auth_nm"
                            @keyup.enter="goSearch(1)"
                            :tabindex="tabIdx.lstIn + 1"
                        />
                    </template>
                </SearchBase>
            </div>
            <!-- /Search -->
            <!-- list -->
            <div id="list-div" :class="cardClass">
                <div class="flex items-center justify-between p-3">
                    <div class="label">
                        <AtomLabel
                            :class-text="labelClassText"
                            :label-text="t('voca.count.argv.default', [authRead ? listCnt : 0])"
                        ></AtomLabel>
                    </div>
                    <div class="commandBtn flex items-end justify-items-end">
                        <AtomButton
                            v-if="authCreate"
                            :type="'create'"
                            :class="btnClass"
                            :class-text="btnClassText"
                            :button-name="'btn.create.default'"
                            @click="goDetail('')"
                            :tabindex="tabIdx.lstBtn + 2"
                        />
                    </div>
                </div>
                <div class="px-3 pb-3">
                    <div class="table table-sort w-full">
                        <div class="flex flex-wrap justify-between items-center min-h-[2.5rem] font-bold">
                            <span
                                data-id="svcType"
                                class="header basis-[10%] text-center"
                                v-if="svcType === 'ALL'"
                                :title="t('voca.service.type.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.service.type.default') }}
                            </span>
                            <span
                                data-id="authId"
                                class="header basis-[18%] text-center"
                                :title="t('voca.auth.id.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.auth.id.default') }}
                            </span>
                            <span
                                data-id="authNm"
                                class="header basis-[18%] text-center"
                                :title="t('voca.auth.name.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.auth.name.default') }}
                            </span>
                            <span
                                data-id="authDc"
                                class="header basis-[21%] text-center"
                                :title="t('voca.auth.description.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.auth.description.default') }}
                            </span>
                            <span
                                data-id="createId"
                                class="header basis-[15%] text-center"
                                :title="t('voca.create.id.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.create.id.default') }}
                            </span>
                            <span
                                data-id="createTime"
                                class="header basis-[18%] text-center"
                                :title="t('voca.create.time.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.create.time.default') }}
                            </span>
                        </div>
                        <div class="divideLine w-full h-[1px] mb-[0.5rem] bg-gray-300" />
                        <div class="body" v-if="authRead">
                            <template v-if="reqList.length > 0">
                                <div
                                    v-for="d in reqList"
                                    :key="d.svc_type + '_' + d.menu_id"
                                    class="flex flex-wrap justify-between items-center pl-2 min-h-[2.5rem] hover:bg-gray-400 hover:text-white"
                                    :class="d?.status?.toLowerCase() == 'fail' ? 'fail' : 'good'"
                                >
                                    <span
                                        class="basis-[10%] text-center"
                                        :title="d.svc_type"
                                        v-if="svcType === 'ALL'"
                                        >{{ d.svc_type }}</span
                                    >
                                    <span
                                        class="basis-[18%] text-center cursor-pointer"
                                        :title="d.auth_id"
                                        @click="goDetail(d)"
                                        >{{ d.auth_id }}</span
                                    >
                                    <span class="basis-[18%]" :title="d.auth_nm">{{ d.auth_nm }}</span>
                                    <span class="basis-[21%]" :title="d.auth_dc">{{ d.auth_dc }}</span>
                                    <span class="basis-[15%]" :title="d.create_id">{{ d.create_id }}</span>
                                    <span class="basis-[18%] text-center" :title="getDateFormat(d.create_time)">{{
                                        getDateFormat(d.create_time)
                                    }}</span>
                                </div>
                            </template>
                            <template v-else>
                                <div
                                    class="no-data flex flex-wrap justify-center content-center pl-2 min-h-[2.5rem] hover:bg-gray-400 hover:text-white"
                                >
                                    <span :title="t('msg.error.info.data.not_exist.default')">{{
                                        t('msg.error.info.data.not_exist.default')
                                    }}</span>
                                </div>
                            </template>
                            <template>
                                <div v-if="paging === 'scroll'" v-show="isAxiosFlag">
                                    <span>
                                        <transition name="fade">
                                            <div v-show="isAxiosFlag" class="loading"></div>
                                        </transition>
                                    </span>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /list -->
            <div class="v-select-out-card">
                <Paging
                    v-if="paging === 'page'"
                    :search-data="searchData"
                    :list-cnt="listCnt"
                    :search-func="goSearch"
                />
            </div>
        </div>
    </div>
    <BasePopup
        class="z-[200]"
        :id="detailId"
        :add-body-class="'p-0'"
        @close="
            () => {
                detailInfo = {};
                commonts.hideModal(detailModal);
            }
        "
    >
        <template v-slot:title>{{ t('voca.auth.details.default') }}</template>
        <template v-slot:msg>
            <AuthDetail
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
</template>

<script setup lang="ts">
// @ is an alias to /src
import Paging from '@/components/common/layout/Paging.vue';
import AuthDetail from '@/components/common/mng/auth/AuthDetail.vue';
import BasePopup from '@/components/common/util/popup/BaseCommon.vue';
import { auth } from '@/plugins/ts/auth';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import AtomButton from '@a/Button.vue';
import AtomLabel from '@a/Label.vue';
import MoleInput from '@m/InputWithLabel.vue';
import SearchBase from '@o/SearchBase.vue';
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue';

const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const cardClass = 'h-fit bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3';
const labelClassText = 'text-black w-full h-12 text-base font-bold';
const classText = 'text-black w-full h-10 text-base';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';
const btnClassText = 'w-full h-12 text-base rounded-md py-2.5 focus:outline-none hover:brightness-75';

const { stores, gProp, commonts, t } = base();
const { authRead, authCreate } = auth();
const { svcType, tabIdx, paging, compPagePerData, getDateFormat } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();

const docName = 'Auth';

const detailId = 'UserDetail';
const detailModal = ref(null as any);

const listCnt = ref(0);
const reqList = ref([] as any);

const detailInfo = ref({} as any);

const searchData = reactive({
    auth_id: '',
    auth_nm: '',
    paging: paging.value,
    page_per_data: compPagePerData.value,
    page: 1,
    sort: 'auth_id desc',
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
            // scroll bottom 도착시 로딩이 전체로 다되지 않은 경우 추가 로드
            if (bottomFlag.value && listCnt.value > reqList.value.length) {
                searchData.page = commonts.getCurrPage(reqList.value.length, searchData) + 1;
                getListCnt();
            } else if (searchData.page === 1 && !bottomFlag.value) {
                reqList.value = [];
                getListCnt();
            }
        }
    }
}

function getListCnt() {
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/management/auth/cnt'), searchData, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                commonts.debugLog(gProp, response);
                listCnt.value = response.data;
                if (listCnt.value > 0) {
                    isAxiosFlag.value = false;
                    goList();
                } else {
                    reqList.value = [];
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
            .post(commonts.getUrl(gProp, '/management/auth/list'), searchData, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
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

function goDetail(data: string | { [x: string]: any }) {
    if (typeof data === 'string') {
        data = {
            id: '',
            svc_type: svcType.value,
            auth_id: data,
            auth_nm: '',
            auth_dc: '',
            use_yn: true
        };
    }
    detailInfo.value = data;
    commonts.setDetailInfo(stores, detailInfo);
    commonts.debugLog(gProp, stores.common.detailInfo);

    // detail page 별도 사용시 view 및 router URL 추가하고 사용
    // router?.replace({ path: "/cmgrpcode/detail" });
    // commonts.showModal(refUserDetail?.value?.$el);
    commonts.showModal(detailModal.value, 200);
}

function nextProcess() {
    // localStorage에 searchData가 저장되어 있는 경우에만 searchData 세팅
    const tempStoredSearchData = stores.common.getSearchData(docName);
    if (tempStoredSearchData) {
        Object.assign(searchData, tempStoredSearchData);
    }
    goSearch();
}

onBeforeMount(() => {});

onMounted(() => {
    nextProcess();
    detailModal.value = commonts.makeModal(detailId);
    // 초기에만 mounted 될때만 초기화 하면 됨
    commonts.initPage({ docNameId: docName, searchData: searchData }, goSearch);
});

//페이지 떠날 떄, searchData 클리어
onUnmounted(() => {
    stores.common.clearSearchData();
});
</script>
