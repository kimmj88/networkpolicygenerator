<template>
    <div :id="docName">
        <div>
            <!-- Search -->
            <div :class="cardClass">
                <SearchBase @click:search="goSearch(1)">
                    <template v-slot:body>
                        <MoleInput
                            :label-class-text="labelClassText"
                            :label-text="t('voca.user.id.default')"
                            :class-text="classText"
                            v-model="searchData.user_id"
                            @keyup.enter="goSearch(1)"
                            :tabindex="tabIdx.detIn"
                        />
                        <MoleInput
                            :label-class-text="labelClassText"
                            :label-text="t('voca.user.id.default')"
                            :class-text="classText"
                            v-model="searchData.user_nm"
                            @keyup.enter="goSearch(1)"
                            :tabindex="tabIdx.detIn + 1"
                        />
                    </template>
                </SearchBase>
            </div>
            <!-- /Search -->
            <!-- list -->
            <div id="list-div" :class="cardClass + ' rounded-b-lg'">
                <div class="flex items-center justify-between p-3">
                    <div class="label">
                        <AtomLabel
                            :class-text="labelClassText"
                            :label-text="t('voca.count.argv.default', [authRead ? listCnt : 0])"
                        ></AtomLabel>
                    </div>
                    <div class="commandBtn flex items-end justify-items-end"></div>
                </div>
                <div class="px-3 pb-3">
                    <div class="table table-sort w-full">
                        <div class="flex flex-wrap justify-between items-center min-h-[2.5rem] font-bold">
                            <span
                                data-id="svcType"
                                class="header basis-[34%] text-center"
                                v-if="svcType === 'ALL'"
                                :title="t('voca.service.type.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.service.type.default') }}
                            </span>
                            <span
                                data-id="cmGrpCd"
                                class="header basis-[33%] text-center"
                                :title="t('voca.user.id.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.user.id.default') }}
                            </span>
                            <span
                                data-id="cmGrpCdNm"
                                class="header basis-[33%] text-center"
                                :title="t('voca.user.name.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.user.name.default') }}
                            </span>
                        </div>
                        <div class="divideLine w-full h-[1px] mb-[0.5rem] bg-gray-300" />
                        <div class="body" v-if="authRead">
                            <template v-if="reqList.length > 0">
                                <div
                                    v-for="d in reqList"
                                    :key="d.grp_cd + '_' + d.cd"
                                    class="flex flex-wrap justify-between items-center pl-2 min-h-[2.5rem] hover:bg-gray-400 hover:text-white"
                                    :class="d?.status?.toLowerCase() == 'fail' ? 'fail' : 'good'"
                                >
                                    <span class="basis-[34%] text-center" :title="d.svc_type" v-if="svcType === 'ALL'">
                                        {{ d.svc_type }}
                                    </span>
                                    <span
                                        class="basis-[33%] cursor-pointer"
                                        :title="d.user_id"
                                        @click="doSelect(d.user_id, d.user_nm)"
                                        >{{ d.user_id }}</span
                                    >
                                    <span class="basis-[33%]" :title="d.user_nm">{{ d.user_nm }}</span>
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
</template>

<script setup lang="ts">
// @ is an alias to /src
import Paging from '@/components/common/layout/Paging.vue';
import { auth } from '@/plugins/ts/auth';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import AtomLabel from '@a/Label.vue';
import MoleInput from '@m/InputWithLabel.vue';
import SearchBase from '@o/SearchBase.vue';
import { onBeforeMount, reactive, ref } from 'vue';

const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    },
    popupFlag: {
        type: Boolean,
        default: false
    },
    popupCloseFunc: Function
});

const cardClass = 'bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700';
const labelClassText = 'text-black w-full h-12 text-base font-bold';
const classText = 'text-black w-full h-10 text-base';

const { stores, emitter, gProp, commonts, t } = base();
const { authRead } = auth();
const { svcType, tabIdx, paging, compPagePerData } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();

const docName = 'UserPopup';

const popupFlag = ref(props.popupFlag);

const listCnt = ref(0);
const reqList = ref([] as any);

const searchData = reactive({
    user_id: '',
    user_nm: '',
    paging: paging.value,
    page_per_data: compPagePerData.value,
    page: 1,
    sort: 'user_id asc',
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
            .post(commonts.getUrl(gProp, '/authorize/user/cnt'), searchData, getAxiosOptions('DATA', {}))
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
            .post(commonts.getUrl(gProp, '/authorize/user/list'), searchData, getAxiosOptions('DATA', {}))
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

function doSelect(userId: string, userNm: string) {
    const userInfo = {
        user_id: userId,
        user_nm: userNm
    };
    console.log('doSelect ', userInfo);
    emit('select:user', userInfo);
}

if (!popupFlag.value) {
    emitter.on('paging', () => {
        commonts.debugLog(gProp, 'page emitter');
        let limitPage =
            Math.floor(listCnt.value / searchData.page_per_data) +
            (listCnt.value % searchData.page_per_data > 0 ? 1 : 0);
        if (limitPage >= gProp?.$pageInfo.page) {
            searchData.page = gProp?.$pageInfo.page;
        }
        goSearch();
    });
}

function nextProcess() {
    // localStorage에 searchData가 저장되어 있는 경우에만 searchData 세팅
    const tempStoredSearchData = stores.common.getSearchData(docName);
    if (tempStoredSearchData) {
        Object.assign(searchData, tempStoredSearchData);
    }
    goSearch();
}

const emit = defineEmits(['select:user']);

onBeforeMount(() => {
    nextProcess();
});
</script>
