<template>
    <div :id="docName">
        <div>
            <!-- Search -->
            <div class="card search-card">
                <div class="p-0">
                    <div class="justify-content-xl-around items-center ml-0 grid-container">
                        <div class="item ellipsis">
                            <span :title="t('voca.access.time.default')">
                                {{ t('voca.access.time.default') }}
                            </span>
                        </div>
                        <div class="item">
                            <datepicker
                                class="form-control form-control-sm p-0 border-0"
                                :modelValue="dp_data.dateRange"
                                @update:modelValue="
                                    dp_func.dateUpdate(
                                        (dp_data.dateRange = $event),
                                        searchData,
                                        ['search_from_time', 'search_to_time'],
                                        goSearch
                                    )
                                "
                                :format="dp_func.dateRangeFormat"
                                range
                                multiCalendars
                                autoApply
                                showNowButton
                                :enableTimePicker="dp_config.enableTimePicker"
                                :weekStart="dp_config.weekStart"
                                :placeholder="dp_config.placeholderStr"
                                :clearable="false"
                                :locale="dp_config.locale"
                                :tabindex="tabIdx.lstIn"
                            >
                                <template #input-icon>
                                    <em class="date-picker" />
                                </template>
                            </datepicker>
                        </div>
                        <div class="item ellipsis">
                            <span :title="t('voca.user.id.default')">
                                {{ t('voca.user.id.default') }}
                            </span>
                        </div>
                        <div class="item">
                            <input
                                type="text"
                                id="user_id"
                                class="form-control border-1 string"
                                v-model.trim.lazy="searchData.user_id"
                                @keyup.enter="goSearch(1)"
                                :placeholder="t('msg.info.input.default')"
                                :tabindex="tabIdx.lstIn + 1"
                            />
                        </div>
                        <div class="item ellipsis">
                            <span :title="t('voca.connection.ip.default')">
                                {{ t('voca.connection.ip.default') }}
                            </span>
                        </div>
                        <div class="item">
                            <input
                                type="text"
                                id="access_ip"
                                class="form-control border-1 string"
                                v-model.trim.lazy="searchData.access_ip"
                                @keyup.enter="goSearch(1)"
                                :placeholder="t('msg.info.input.default')"
                                :tabindex="tabIdx.lstIn + 2"
                            />
                        </div>
                        <div class="item-search">
                            <button
                                v-if="authRead"
                                class="btn btn-min-w-100 mr-2"
                                @click="goSearch(1)"
                                :tabindex="tabIdx.lstBtn"
                            >
                                <a>{{ t('btn.search.default') }}</a>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /Search -->
            <!-- list -->
            <div id="list-div" class="card">
                <div class="card-body">
                    <div class="titleBar">
                        <span class="title" :title="t('voca.count.argv.default', [authRead ? listCnt : 0])">
                            {{ t('voca.count.argv.default', [authRead ? listCnt : 0]) }}
                        </span>
                        <div class="btns">
                            <button
                                v-if="authExcel"
                                class="btn btn-secondary bxc bxc-download btn-min-w-100 ml-3"
                                @click="goExcelExport"
                                :tabindex="tabIdx.lstBtn + 2"
                            >
                                <a>{{ t('btn.excel.download.default') }}</a>
                            </button>
                            <button
                                v-if="authCreateUpdate && authExcel"
                                class="btn btn-secondary bxc bxc-upload btn-min-w-100 ml-3"
                                @click="goExcelImport"
                                :tabindex="tabIdx.lstBtn + 3"
                            >
                                <a>{{ t('btn.excel.upload.default') }}</a>
                            </button>
                        </div>
                    </div>
                    <div class="table table-sort w-full">
                        <div class="flex justify-between content-between">
                            <span
                                class="header basis-1/6 text-center"
                                v-if="svcType === 'ALL'"
                                :title="t('voca.service.type.default')"
                                >{{ t('voca.service.type.default') }}</span
                            >
                            <span class="header basis-1/6 text-center" :title="t('voca.user.id.default')">{{
                                t('voca.user.id.default')
                            }}</span>
                            <span class="header basis-2/6 text-center" :title="t('voca.connection.ip.default')">{{
                                t('voca.connection.ip.default')
                            }}</span>
                            <span class="header basis-1/6 text-center" :title="t('voca.connection.status.default')">{{
                                t('voca.connection.status.default')
                            }}</span>
                            <span class="header basis-2/6 text-center" :title="t('voca.access.time.default')">{{
                                t('voca.access.time.default')
                            }}</span>
                            <span class="header basis-1/6 text-center" :title="t('voca.verify.default')">{{
                                t('voca.verify.default')
                            }}</span>
                        </div>
                        <div class="divideLine" />
                        <div class="body" v-if="authRead">
                            <template v-if="reqList.length > 0">
                                <div
                                    v-for="d in reqList"
                                    :key="d.doc_no"
                                    class="flex justify-between content-between"
                                    :class="d?.status?.toLowerCase() == 'fail' ? 'fail' : 'good'"
                                >
                                    <span class="basis-1/6 text-center" :title="d.svc_type" v-if="svcType === 'ALL'">
                                        {{ d.svc_type }}
                                    </span>
                                    <span class="basis-1/6" :title="d.user_id">{{ d.user_id }}</span>
                                    <span class="basis-2/6" :title="d.access_ip">{{ d.access_ip }}</span>
                                    <span class="basis-1/6" :title="t('msg.access.yn.' + d.access_flag)">{{
                                        t('msg.access.yn.' + d.access_flag)
                                    }}</span>
                                    <span class="basis-2/6 text-center" :title="getDateFormat(d.create_time)">{{
                                        getDateFormat(d.create_time)
                                    }}</span>
                                    <span
                                        :class="d.id"
                                        class="basis-1/6 cursor-pointer"
                                        :title="d.signature"
                                        @click="verifySignature(d)"
                                        >{{ t('voca.verify.default') }}</span
                                    >
                                </div>
                            </template>
                            <template v-else>
                                <div class="no-data">
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
        </div>
        <!-- /list -->
        <div class="v-select-out-card">
            <Paging v-if="paging === 'page'" :search-data="searchData" :list-cnt="listCnt" :search-func="goSearch" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Paging from '@/components/common/layout/Paging.vue';
import { auth } from '@/plugins/ts/auth';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { datepicker } from '@/plugins/ts/datepicker';
import { fileUpDown } from '@/plugins/ts/fileUpDown';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';

const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const { stores, gProp, commonts, t } = base();
const { authRead, authExcel, authCreateUpdate } = auth();
const { svcType, tabIdx, paging, compPagePerData, getDateFormat } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();
const { dp_config, dp_data, dp_func } = datepicker({ type: 'month' });
const { goUpload, doExcelExport } = fileUpDown();

const docName = 'Access';

const listCnt = ref(0);
const reqList = ref([] as any);

const searchData = reactive({
    user_id: '',
    access_ip: '',
    search_from_time: dp_data.dateRangeSearch[0],
    search_to_time: dp_data.dateRangeSearch[1],
    paging: paging.value,
    page_per_data: compPagePerData.value,
    page: 1,
    sort: 'create_time desc',
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
            .post(commonts.getUrl(gProp, '/log/access/cnt'), searchData, getAxiosOptions('DATA', {}))
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
            .post(commonts.getUrl(gProp, '/log/access/list'), searchData, getAxiosOptions('DATA', {}))
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

function setMessage(target: Element | null, className: string, message: string) {
    let classes = {
        success: 'text-green-500',
        fail: 'text-red-500',
        no_sig: 'text-gray-500'
    } as any;

    if (target !== null) {
        target.innerHTML = t('voca.verify.default');
    }
    for (let idx in Object.getOwnPropertyNames(classes)) {
        if (target?.classList.contains(classes[Object.getOwnPropertyNames(classes)[idx]])) {
            target.classList.remove(classes[Object.getOwnPropertyNames(classes)[idx]]);
        }
    }

    if (target !== null) {
        target.innerHTML = message;
    }
    target?.classList.add(classes[className]);
}

function verifySignature(rowData: any) {
    commonts.debugLog(gProp, [docName, 'verifySignature axios']);
    let target = document.querySelector('.' + rowData.id);
    gProp?.axios
        .post(commonts.getUrl(gProp, '/log/access/verify/signature'), rowData, getAxiosOptions('DATA', {}))
        .then(function (response: any) {
            commonts.debugLog(gProp, response);
            if (!response.data['errorCode']) {
                console.log(rowData.id);
                if (response.data === true) {
                    setMessage(target, 'success', t('voca.verify.success.default'));
                } else {
                    setMessage(target, 'fail', t('voca.data.tampered.default'));
                }
            } else {
                setMessage(target, 'no_sig', t('voca.signature.not_exist.default'));
            }
        })
        .catch(getErrorFunc)
        .finally(getFinallyFunc);
}

function goExcelExport() {
    doExcelExport('/log/access/export/excel', searchData);
}

function goExcelImport() {
    goUpload('/log/access/import/excel', 'EXCEL_FILE_UPLOAD', goSearch);
}

function nextProcess() {
    commonts.setSearchData(stores, searchData, docName);
    goSearch();
}

if (
    stores.common?.searchData &&
    stores.common?.searchData[docName] &&
    Object.keys(stores.common.searchData[docName]).length !== 0
) {
    Object.keys(stores.common.searchData[docName]).forEach((key: string) => {
        searchData[key] = stores.common.searchData[docName][key];
    });
}

onBeforeMount(() => {
    nextProcess();
});

onMounted(() => {
    // 초기에만 mounted 될때만 초기화 하면 됨
    commonts.setSearchData(stores, searchData, docName);
    commonts.initPage({ docNameId: docName, searchData: searchData }, goSearch);
});
</script>
