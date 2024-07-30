<template>
    <div :id="docName">
        <div>
            <!-- Search -->
            <div :class="cardClass">
                <SearchBase @click:search="goSearch(1)" :show-search-btn="false">
                    <template v-slot:body>
                        <MoleSelect
                            :label-class-text="labelClassText"
                            :label-text="t('voca.auth.id.default')"
                            :options="authUserList"
                            v-model="searchData.auth_id"
                            :placeholder="t('msg.info.select.default')"
                            @update:modelValue="goSearch(1)"
                            :get-option-label="
                                (option: any) => setEmptyMsg(option, option?.auth_nm + '(' + option?.auth_id + ')')
                            "
                            :reduce="(option: any) => option?.auth_id"
                        />
                    </template>
                </SearchBase>
            </div>
            <!-- /Search -->
            <!-- list -->
            <div id="list-div" :class="cardClass">
                <div class="flex items-center justify-between p-3">
                    <div class="label h-12 inline-flex items-center">
                        <AtomLabel
                            :class-text="labelClassText"
                            :label-text="t('voca.count.argv.default', [authRead ? listCnt : 0])"
                        ></AtomLabel>
                    </div>
                    <div class="commandBtn flex items-end justify-items-end">
                        <AtomButton
                            v-if="authCreate && searchData.auth_id !== ''"
                            :type="'create'"
                            :class="btnClass"
                            :class-text="btnClassText"
                            :button-name="'btn.create.default'"
                            @click="toggleAddUser"
                            :tabindex="tabIdx.lstBtn + 1"
                        />
                    </div>
                </div>
                <div class="px-3 pb-3">
                    <div class="table table-sort w-full">
                        <div class="flex flex-wrap justify-between items-center min-h-[2.5rem] font-bold">
                            <span
                                data-id="svcType"
                                class="header basis-[28%] text-center"
                                v-if="svcType === 'ALL'"
                                :title="t('voca.service.type.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.service.type.default') }}
                            </span>
                            <span
                                data-id="menuId"
                                class="header basis-[28%] text-center"
                                :title="t('voca.user.id.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.user.id.default') }}
                            </span>
                            <span
                                data-id="menuNm"
                                class="header basis-[28%] text-center"
                                :title="t('voca.user.name.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.user.name.default') }}
                            </span>
                            <span
                                data-id="menuUrl"
                                class="header basis-[16%] text-center"
                                :title="t('voca.delete.default')"
                            >
                                <em class="sort"></em>
                                {{ t('voca.delete.default') }}
                            </span>
                        </div>
                        <div class="divideLine w-full h-[1px] mb-[0.5rem] bg-gray-300" />
                        <div class="body" v-if="authRead">
                            <template v-if="reqList.length > 0">
                                <div
                                    v-for="d in reqList"
                                    :key="d.svc_type + '_' + d.user_id"
                                    class="flex flex-wrap justify-between items-center pl-2 min-h-[2.5rem] hover:bg-gray-400 hover:text-white"
                                    :class="d?.status?.toLowerCase() == 'fail' ? 'fail' : 'good'"
                                >
                                    <span class="basis-[28%] text-center" :title="d.svc_type" v-if="svcType === 'ALL'">
                                        {{ d.svc_type }}
                                    </span>
                                    <span class="basis-[28%] text-center" :title="d.user_id">{{ d.user_id }}</span>
                                    <span class="basis-[28%] text-center" :title="d.user_nm">{{ d.user_nm }}</span>
                                    <span class="basis-[16%] inline-flex justify-center">
                                        <AtomButton
                                            v-if="authUpdateDelete && searchData.auth_id !== ''"
                                            class="min-w-[7rem]"
                                            :button-name="'btn.delete.default'"
                                            :type="'delete'"
                                            :class-text="listBtnClassText"
                                            @click="doDeleteConfirm(d.id, d.auth_id, d.user_id)"
                                            :tabindex="tabIdx.lstBtn + 2"
                                        />
                                    </span>
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
        <template v-slot:title>{{ t('voca.user.add.default') }}</template>
        <template v-slot:msg>
            <UserPopup
                :popup-flag="true"
                :popup-close-func="goSearch"
                @close="
                    () => {
                        detailInfo = {};
                        commonts.hideModal(detailModal);
                    }
                "
                @select:user="selectUser"
            />
        </template>
        <!-- <template v-slot:mFooter></template> -->
    </BasePopup>
</template>

<script setup lang="ts">
// @ is an alias to /src
import Paging from '@/components/common/layout/Paging.vue';
import BasePopup from '@/components/common/util/popup/BaseCommon.vue';
import UserPopup from '@/components/common/util/popup/UserPopup.vue';
import { auth } from '@/plugins/ts/auth';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import AtomButton from '@a/Button.vue';
import AtomLabel from '@a/Label.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import SearchBase from '@o/SearchBase.vue';
import { onBeforeMount, onMounted, onUnmounted, onUpdated, reactive, ref } from 'vue';
const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const cardClass = 'h-fit bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3';
const labelClassText = 'text-black w-full h-12 text-base font-bold';
const btnClass = 'min-w-[7rem] min-h-[2.5rem] ml-3';
const btnClassText = 'w-full h-12 text-base rounded-md py-1.5 focus:outline-none hover:brightness-75';
const listBtnClassText = 'w-full h-9 text-base rounded-md py-1.5 focus:outline-none hover:brightness-75';

const { stores, emitter, gProp, commonts, t } = base();
const { authRead, authCreate, authUpdateDelete } = auth();
const { svcType, tabIdx, paging, compPagePerData, setEmptyMsg } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();

const docName = 'AuthUser';

const authUserList = ref([] as any);

const detailId = 'UserDetail';
const detailModal = ref(null as any);

const listCnt = ref(0);
const reqList = ref([] as any);

const detailInfo = ref({} as any);

const searchData = reactive({
    auth_id: '',
    paging: paging.value,
    page_per_data: compPagePerData.value,
    page: 1,
    svc_type: svcType.value
} as any);

const deleteData = reactive({
    id: '',
    auth_id: '',
    user_id: ''
});

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
    initData();
    if (!commonts.isEmpty(searchData.auth_id)) {
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
}

function getListCnt() {
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/management/authuser/cnt'), searchData, getAxiosOptions('DATA', {}))
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
            .post(commonts.getUrl(gProp, '/management/authuser/list'), searchData, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                commonts.debugLog(gProp, response);
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

function doSave(authId: string, userInfo: { [x: string]: any }) {
    // data validation
    if (!commonts.validator(gProp, docName)) {
        return false;
    }

    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        gProp?.axios
            .post(
                commonts.getUrl(gProp, '/management/authuser/insert'),
                {
                    svc_type: svcType.value,
                    auth_id: authId,
                    user_id: userInfo.user_id
                },
                getAxiosOptions('DATA', {})
            )
            .then(function () {
                commonts.notificationShow(gProp, 'success', t('msg.info.save.default'));
                closeModal();
                isAxiosFlag.value = false;
                goSearch(1);
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function closeModal() {
    commonts.hideModal(detailModal.value);
}

function doDeleteConfirm(id: string, auth_id: string, user_id: string) {
    deleteData.id = id;
    deleteData.auth_id = auth_id;
    deleteData.user_id = user_id;

    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.delete.default'),
        method: 'YN',
        cbFunc: doDeleteProcess
    });
}

function doDeleteProcess(retVal: boolean) {
    if (retVal) {
        doDelete();
    }

    deleteData.id = '';
    deleteData.auth_id = '';
    deleteData.user_id = '';
    return false;
}

async function doDelete() {
    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;
        await gProp?.axios
            .post(commonts.getUrl(gProp, '/management/authuser/delete'), deleteData, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                commonts.debugLog(gProp, response);
                isAxiosFlag.value = false;
                goSearch(1);
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function toggleAddUser() {
    commonts.setDetailInfo(stores, detailInfo);

    if (searchData.auth_id === '') {
        commonts.debugLog(gProp, 'todo error');
    } else {
        commonts.showModal(detailModal.value, 200);
    }
}

function initData() {
    if (commonts.isEmpty(searchData.auth_id)) {
        commonts.debugLog(gProp, 'init data', reqList.value);
        reqList.value = [];
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

function selectUser(userInfo: { [x: string]: any }) {
    console.log(selectUser);
    let flag = true;

    // 기등록 여부 체크
    reqList.value.forEach((data: { [x: string]: any }) => {
        if (data.user_id === userInfo.user_id) {
            flag = false;
            return flag;
        }
    });

    flag
        ? doSave(searchData.auth_id, userInfo)
        : commonts.notificationShow(gProp, 'error', t('msg.error.info.user.already.default'));
}

onBeforeMount(() => {
    gProp?.axios.all([commonts.getAuthList(gProp)]).then(
        gProp?.axios.spread((authList: Array<{ [x: string]: any }>) => {
            if (svcType.value === 'ALL') {
                authUserList.value = authList;
            } else {
                for (let i in authList) {
                    if (authList[i].svc_type === svcType.value) {
                        authUserList.value.push(authList[i]);
                        commonts.debugLog(gProp, authUserList);
                    }
                }
            }
        })
    );
});

onMounted(() => {
    nextProcess();
    detailModal.value = commonts.makeModal(detailId);
    commonts.initPage({ docNameId: docName });
});

onUpdated(() => {
    // detail 화면 popup 처리시 데이터 변경시 update 이벤트로 처리 가능 (popup 처리시 list 렌더링시에 랜더링이 같이됨)
    commonts.initPage({ docNameId: docName });
});

//페이지 떠날 떄, searchData 클리어
onUnmounted(() => {
    stores.common.clearSearchData();
});
</script>
