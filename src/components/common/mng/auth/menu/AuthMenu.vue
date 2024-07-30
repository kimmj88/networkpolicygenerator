<template>
    <div :id="docName">
        <TemplateBase>
            <template v-slot:header>
                <div :class="cardClass">
                    <SearchBase @click:search="goSearch(1)" :show-search-btn="false">
                        <template v-slot:body>
                            <MoleSelect
                                :label-class-text="labelClassText"
                                :label-text="t('voca.auth.id.default')"
                                :options="authList"
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
            </template>
            <template v-slot:body>
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
                                v-if="authCreateUpdate && !commonts.isEmpty(searchData.auth_id)"
                                :type="'save'"
                                :class="btnClass"
                                :class-text="btnClassText"
                                :button-name="'btn.save.default'"
                                @click="doSave"
                                :tabindex="tabIdx.lstBtn"
                            />
                        </div>
                    </div>
                    <div class="px-3 pb-3">
                        <div class="flex p-0 w-full">
                            <div class="card p-0 tb-mg-em04 tb-mg-r0 mode-hide-item-resize w-4/12">
                                <div id="menuTb" class="check-root table table-sort w-full">
                                    <div
                                        class="header flex flex-wrap justify-between items-center min-h-[2.5rem] font-bold"
                                    >
                                        <AtomInput
                                            :input-type="'checkbox'"
                                            :id="'cbAllMenu'"
                                            class="basis-[10%] flex justify-center"
                                            :class-text="'checkAll'"
                                        />
                                        <AtomLabel
                                            :class-text="labelClassText + ' font-bold'"
                                            :label-text="t('voca.menu.id.default')"
                                            class="basis-[40%] text-center"
                                        />
                                        <AtomLabel
                                            :class-text="labelClassText + ' font-bold'"
                                            :label-text="t('voca.menu.name.default')"
                                            class="basis-[50%] text-center"
                                        />
                                    </div>
                                    <div class="divideLine w-full h-[1px] mb-[0.5rem] bg-gray-300" />
                                    <div class="body" v-if="authRead">
                                        <template v-if="unAuthorizedMenuList.length > 0">
                                            <div
                                                v-for="d in unAuthorizedMenuList"
                                                :key="d.grp_cd + '_' + d.cd"
                                                class="flex flex-wrap justify-between items-center min-h-[2.5rem] hover:bg-gray-400 hover:text-white"
                                                :class="d?.status?.toLowerCase() == 'fail' ? 'fail' : 'good'"
                                                :id="'row-cbMenu' + d.menu_id"
                                            >
                                                <AtomInput
                                                    :input-type="'checkbox'"
                                                    :id="'cbMenu' + d.menu_id"
                                                    :name="'cbAllMenu'"
                                                    class="basis-[10%] flex justify-center"
                                                    :class-text="'selectRow'"
                                                />
                                                <AtomLabel
                                                    :id="'cbMenu' + d.menu_id"
                                                    :class-text="labelClassText"
                                                    :label-text="d?.menu_id"
                                                    class="basis-[40%] text-center"
                                                />
                                                <AtomLabel
                                                    :id="'cbMenu' + d.menu_id"
                                                    :class-text="labelClassText"
                                                    :label-text="d?.menu_nm"
                                                    class="basis-[50%]"
                                                />
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div
                                                class="no-data flex flex-wrap justify-center content-center min-h-[2.5rem] hover:bg-gray-400 hover:text-white"
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
                            <div class="w-1/12 p-0 flex justify-center items-center">
                                <div class="flex flex-column justify-center items-center p-2 w-full h-full">
                                    <AtomButton
                                        :type="'save'"
                                        class="w-[3rem] h-[3rem]"
                                        :class-text="btnClassText + ' bxc bxc-chevron-right'"
                                        :button-name="''"
                                        @click="toRight"
                                    />
                                    <AtomButton
                                        :type="'delete'"
                                        class="w-[3rem] h-[3rem] ml-3"
                                        :class-text="btnClassText + ' bxc bxc-chevron-left min-w-[2rem] min-h-[2rem]'"
                                        :button-name="''"
                                        @click="toLeft"
                                    />
                                </div>
                            </div>
                            <div class="card p-0 text-right tb-mg-em04 tb-mg-l0 mode-hide-item-resize w-7/12">
                                <div id="authTb" class="check-root table table-sort w-full">
                                    <div
                                        class="header flex flex-wrap justify-between items-center min-h-[2.5rem] font-bold"
                                    >
                                        <AtomInput
                                            :input-type="'checkbox'"
                                            :id="'cbAllAuth'"
                                            class="basis-[5%] flex justify-center"
                                            :class-text="'checkAll'"
                                        />
                                        <AtomLabel
                                            :class-text="labelClassText + ' font-bold'"
                                            :label-text="t('voca.menu.id.default')"
                                            class="basis-[15%] text-center"
                                        />
                                        <AtomLabel
                                            :class-text="labelClassText + ' font-bold'"
                                            :label-text="t('voca.menu.name.default')"
                                            class="basis-[35%] text-center"
                                        />
                                        <AtomInput
                                            :input-type="'checkbox'"
                                            :id="'cbAllAuth_1'"
                                            :label-class-text="labelClassText + ' font-bold ml-1'"
                                            :label-text="t('voca.read.default')"
                                            class="basis-[7%] flex justify-center"
                                            class-text="checkAll"
                                            :true-value="'Y'"
                                            :false-value="'N'"
                                        />
                                        <AtomInput
                                            :input-type="'checkbox'"
                                            :id="'cbAllAuth_2'"
                                            :label-class-text="labelClassText + ' font-bold ml-1'"
                                            :label-text="t('voca.create.default')"
                                            class="basis-[7%] flex justify-center"
                                            class-text="checkAll"
                                            :true-value="'Y'"
                                            :false-value="'N'"
                                        />
                                        <AtomInput
                                            :input-type="'checkbox'"
                                            :id="'cbAllAuth_3'"
                                            :label-class-text="labelClassText + ' font-bold ml-1'"
                                            :label-text="t('voca.update.default')"
                                            class="basis-[7%] flex justify-center"
                                            class-text="checkAll"
                                            :true-value="'Y'"
                                            :false-value="'N'"
                                        />
                                        <AtomInput
                                            :input-type="'checkbox'"
                                            :id="'cbAllAuth_4'"
                                            :label-class-text="labelClassText + ' font-bold ml-1'"
                                            :label-text="t('voca.delete.default')"
                                            class="basis-[7%] flex justify-center"
                                            class-text="checkAll"
                                            :true-value="'Y'"
                                            :false-value="'N'"
                                        />
                                        <AtomInput
                                            :input-type="'checkbox'"
                                            :id="'cbAllAuth_5'"
                                            :label-class-text="labelClassText + ' font-bold ml-1'"
                                            :label-text="t('voca.excel.default')"
                                            class="basis-[7%] flex justify-center"
                                            class-text="checkAll"
                                            :true-value="'Y'"
                                            :false-value="'N'"
                                        />
                                    </div>
                                    <div class="divideLine w-full h-[1px] mb-[0.5rem] bg-gray-300" />
                                    <div class="body" v-if="authRead">
                                        <template v-if="authorizedMenuList.length > 0">
                                            <div
                                                v-for="d in authorizedMenuList"
                                                :key="d.grp_cd + '_' + d.cd"
                                                class="row flex flex-wrap justify-between items-center min-h-[2.5rem] hover:bg-gray-400 hover:text-white"
                                                :class="d?.status?.toLowerCase() == 'fail' ? 'fail' : 'good'"
                                                :id="'row-cbMenu' + d.menu_id"
                                                :data-id="d.id"
                                            >
                                                <AtomInput
                                                    :input-type="'checkbox'"
                                                    :id="'cbMenu' + d.menu_id"
                                                    :name="'cbAllAuth'"
                                                    class="basis-[5%] flex justify-center row-item"
                                                    :class-text="'selectRow'"
                                                />
                                                <AtomLabel
                                                    :id="'cbMenu' + d.menu_id"
                                                    :class-text="labelClassText"
                                                    :label-text="d.menu_id"
                                                    class="basis-[15%] text-center row-item"
                                                />
                                                <AtomLabel
                                                    :id="'cbMenu' + d.menu_id"
                                                    :class-text="labelClassText"
                                                    :label-text="d.menu_nm"
                                                    class="basis-[35%] text-left row-item"
                                                />
                                                <AtomInput
                                                    :input-type="'checkbox'"
                                                    :id="'cbMenuRead' + d.menu_id"
                                                    :name="'cbAllAuth_1'"
                                                    class="basis-[7%] row-item flex justify-center"
                                                    v-model="d.read_yn"
                                                    :true-value="'Y'"
                                                    :false-value="'N'"
                                                />
                                                <AtomInput
                                                    :input-type="'checkbox'"
                                                    :id="'cbMenuCreate' + d.menu_id"
                                                    :name="'cbAllAuth_2'"
                                                    class="basis-[7%] row-item flex justify-center"
                                                    v-model="d.create_yn"
                                                    :true-value="'Y'"
                                                    :false-value="'N'"
                                                />
                                                <AtomInput
                                                    :input-type="'checkbox'"
                                                    :id="'cbMenuUpdate' + d.menu_id"
                                                    :name="'cbAllAuth_3'"
                                                    class="basis-[7%] row-item flex justify-center"
                                                    v-model="d.update_yn"
                                                    :true-value="'Y'"
                                                    :false-value="'N'"
                                                />
                                                <AtomInput
                                                    :input-type="'checkbox'"
                                                    :id="'cbMenuDelete' + d.menu_id"
                                                    :name="'cbAllAuth_4'"
                                                    class="basis-[7%] row-item flex justify-center"
                                                    v-model="d.delete_yn"
                                                    :true-value="'Y'"
                                                    :false-value="'N'"
                                                />
                                                <AtomInput
                                                    :input-type="'checkbox'"
                                                    :id="'cbMenuExcel' + d.menu_id"
                                                    :name="'cbAllAuth_5'"
                                                    class="basis-[7%] row-item flex justify-center"
                                                    v-model="d.excel_yn"
                                                    :true-value="'Y'"
                                                    :false-value="'N'"
                                                />
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div
                                                class="no-data flex flex-wrap justify-center content-center min-h-[2.5rem] hover:bg-gray-400 hover:text-white"
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
                    </div>
                </div>
            </template>
        </TemplateBase>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { auth } from '@/plugins/ts/auth';
import { axios } from '@/plugins/ts/axios';
import { base } from '@/plugins/ts/base';
import { btnClass, btnClassText, cardClass, labelClassText } from '@/plugins/ts/classText';
import { commonVar } from '@/plugins/ts/commonVar';
import AtomButton from '@a/Button.vue';
import AtomInput from '@a/Input.vue';
import AtomLabel from '@a/Label.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import SearchBase from '@o/SearchBase.vue';
import TemplateBase from '@o/TemplateBase.vue';
import { computed, onBeforeMount, onMounted, onUnmounted, reactive, ref } from 'vue';

const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const { stores, gProp, commonts, t } = base();
const { authRead, authCreateUpdate } = auth();
const { tabIdx, paging, svcType, setEmptyMsg } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc } = axios();

const docName = 'AuthMenu';

const listCnt = ref(0);
const authList = ref([] as any);
//왼쪽 권한 메뉴
// const menuList = ref([] as any);

//권한 메뉴 리스트(우측)
const authorizedMenuList = ref([] as any[]);
//전체 메뉴 리스트
const entireMenuList = ref([] as any[]);
//권한 없는 메뉴 리스트(왼쪽)
const unAuthorizedMenuList = computed(() => {
    const temp: any[] = [];
    entireMenuList.value.forEach((menu) => {
        const coExistMenu = authorizedMenuList.value.find((curMenu) => {
            return curMenu.menu_id === menu.menu_id;
        });
        if (!coExistMenu && !temp.find((tm) => tm.menu_id === menu.menu_id)) {
            temp.push(menu);
        }
    });
    return temp;
});

const dataFlag = ref(!(listCnt.value === undefined || listCnt.value === 0));

const searchData = reactive({
    auth_id: '',
    paging: paging.value,
    page_per_data: 9999,
    page: 1,
    sort: 'menu_id asc',
    svc_type: svcType.value
} as any);

// function getTableInfo(tableId: string) {
//     const div = document?.getElementById(tableId)?.querySelectorAll("body div.row");
//     const tmpList = [] as any;
//     Array.prototype.forEach.call(div, function (data: HTMLElement) {
//         const bodyDiv = data.querySelectorAll("div.row-item");
//         commonts.debugLog(gProp, bodyDiv[0]?.querySelector("div input[type='checkbox']"));
//         // innerHtml 시 끝에 공백 추가되어서 trim() 처리
//         const authData = {
//             auth_id: searchData.auth_id,
//             menu_id: bodyDiv[1]?.querySelector("span")?.innerHTML.trim(),
//             menu_nm: bodyDiv[2]?.querySelector("span")?.innerHTML.trim(),
//             create_yn: bodyDiv[3]?.querySelector("div input[type='checkbox']:checked") ? "Y" : "N",
//             read_yn: bodyDiv[4]?.querySelector("div input[type='checkbox']:checked") ? "Y" : "N",
//             update_yn: bodyDiv[5]?.querySelector("div input[type='checkbox']:checked") ? "Y" : "N",
//             delete_yn: bodyDiv[6]?.querySelector("div input[type='checkbox']:checked") ? "Y" : "N",
//             excel_yn: bodyDiv[7]?.querySelector("div input[type='checkbox']:checked") ? "Y" : "N",
//             svc_type: svcType.value,
//             id: data?.dataset?.id,
//         };
//         tmpList.push(authData);
//     });
//     return tmpList;
// }

function toRight() {
    let tableChecks = document
        ?.getElementById('menuTb')
        ?.querySelectorAll('body div input[type="checkbox"].selectRow:checked');

    if (tableChecks !== null && tableChecks !== undefined) {
        tableChecks.forEach((e) => {
            commonts.debugLog(gProp, e);
            // innerHtml 시 끝에 공백 추가되어서 trim() 처리
            let menuId = (e?.parentNode?.nextSibling as HTMLDivElement).querySelector('span')?.innerHTML.trim();
            let menuNm = (e?.parentNode?.nextSibling?.nextSibling as HTMLDivElement)
                .querySelector('span')
                ?.innerHTML.trim();
            const menuData = {
                id: '',
                auth_id: searchData.auth_id,
                svc_type: svcType.value,
                menu_id: menuId,
                menu_nm: menuNm,
                create_yn: 'N',
                read_yn: 'Y',
                update_yn: 'N',
                delete_yn: 'N',
                excel_yn: 'N'
            };

            if (authorizedMenuList.value === null) {
                authorizedMenuList.value = [];
            }
            authorizedMenuList.value.push(menuData);
        });
    }
    commonts.sortList(authorizedMenuList.value, 'menu_id');
}

function toLeft() {
    let tableChecks = document
        ?.getElementById('authTb')
        ?.querySelectorAll('body div input[type="checkbox"].selectRow:checked');

    if (tableChecks !== null && tableChecks !== undefined) {
        tableChecks.forEach((e) => {
            commonts.debugLog(gProp, e);
            // innerHtml 시 끝에 공백 추가되어서 trim() 처리
            let menuId = (e?.parentNode?.nextSibling as HTMLDivElement).querySelector('span')?.innerHTML.trim();

            //지우려는 menu만 filtering
            authorizedMenuList.value = authorizedMenuList.value.filter((a_menu: { [x: string]: any }) => {
                return a_menu.menu_id !== menuId;
            });
        });
    }
}

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
        //세팅된 searchData store를 통해 localStorage에 저장
        commonts.setSearchData(stores, searchData, docName);
    }
}

function goSearch(data?: number | { [x: string]: any }) {
    initData();
    if (!commonts.isEmpty(searchData.auth_id)) {
        bottomFlag.value = false;
        setSearchData(data);
        if (!isAxiosFlag.value) {
            // page 처리인 경우, 최초 로딩시
            if (paging.value === 'page' || authorizedMenuList.value.length === 0) {
                getListCnt();
            } else if (paging.value === 'scroll') {
                // scroll bottom 도착시 로딩이 전체로 다되지 않은 경우 추가 로드
                if (bottomFlag.value && listCnt.value > authorizedMenuList.value.length) {
                    searchData.page = commonts.getCurrPage(authorizedMenuList.value.length, searchData) + 1;
                    getListCnt();
                } else if (searchData.page === 1 && !bottomFlag.value) {
                    authorizedMenuList.value = [];
                    getListCnt();
                }
            }
        }
    }
}

function getListCnt() {
    if (!isAxiosFlag.value) {
        commonts.debugLog(gProp, [docName, 'getListCnt axios']);
        isAxiosFlag.value = true;
        gProp?.axios
            .post(commonts.getUrl(gProp, '/management/authmenu/cnt'), searchData, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                commonts.debugLog(gProp, response);
                listCnt.value = response.data;
                isAxiosFlag.value = false;
                if (listCnt.value > 0) {
                    goList();
                } else {
                    commonts.debugLog(gProp, 'list0-getMenuInfo');
                    initData();
                    getEntireMenuList();
                }
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

/**
 * 권한을 가지고 있는 메뉴 리스트를 조회 해 오는 함수
 */
function goList() {
    if (!isAxiosFlag.value) {
        commonts.debugLog(gProp, [docName, 'goList axios']);
        isAxiosFlag.value = true;
        Object.assign(searchData, commonts.checkSearchData(paging.value, searchData, authorizedMenuList.value));
        gProp?.axios
            .post(commonts.getUrl(gProp, '/management/authmenu/list'), searchData, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                dataFlag.value = true;
                if (svcType.value === 'ALL') {
                    authorizedMenuList.value = response.data;
                } else {
                    response.data.forEach((data: { [x: string]: any }) => {
                        if (data.svc_type === svcType.value || data.svc_type === 'ALL') {
                            authorizedMenuList.value.push(data);
                        }
                    });
                }

                getEntireMenuList();
            })
            .catch((error: any) => {
                dataFlag.value = false;
                commonts.debugLog(gProp, error);

                // unautorith
                if (error?.response?.status === 401) {
                    commonts.notificationShow(gProp, 'error', t('msg.error.info.unauthorized.default'));
                } else {
                    commonts.notificationShow(gProp, 'error', t('msg.error.info.request.default'));
                }

                return false;
            })
            .finally(getFinallyFunc);
    }
}

/**
 * 시스템에 등록된 모든 메뉴 리스트를 조회해 오는 함수
 */
function getEntireMenuList() {
    if (!isAxiosFlag.value) {
        commonts.debugLog(gProp, [docName, 'goList axios']);
        isAxiosFlag.value = true;
        const body = {
            menu_id: '',
            menu_nm: '',
            paging: paging.value,
            page_per_data: 99999,
            page: 1,
            svc_type: svcType.value
        };
        gProp?.axios
            .post(commonts.getUrl(gProp, '/management/menu/list'), body, getAxiosOptions('DATA', {}))
            .then(function (response: any) {
                commonts.debugLog(gProp, response);
                const temp = response.data.slice();
                temp.forEach((tm: { [x: string]: any }) => {
                    if (
                        (svcType.value === 'ALL' && tm.menu_url !== 'parentdir') ||
                        (svcType.value !== 'ALL' &&
                            (tm.svc_type === svcType.value || tm.svc_type === 'ALL') &&
                            tm.menu_url !== 'parentdir')
                    ) {
                        entireMenuList.value.push(tm);
                    }
                });
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function doSave() {
    // data validation
    if (!commonts.validator(gProp, docName)) {
        return false;
    }

    if (!isAxiosFlag.value) {
        isAxiosFlag.value = true;

        let url = dataFlag.value
            ? commonts.getUrl(gProp, '/management/authmenu/update')
            : commonts.getUrl(gProp, '/management/authmenu/insert');
        gProp?.axios
            .post(url, authorizedMenuList.value, getAxiosOptions('DATA', {}))
            .then(function () {
                commonts.notificationShow(gProp, 'success', t('msg.info.save.default'));
                isAxiosFlag.value = false;
                authorizedMenuList.value = [];
                goSearch();
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
}

function nextProcess() {
    console.log('nextProcess');
    // localStorage에 searchData가 저장되어 있는 경우에만 searchData 세팅
    const tempStoredSearchData = stores.common.getSearchData(docName);
    if (tempStoredSearchData) {
        Object.assign(searchData, tempStoredSearchData);
    }
    goSearch();
}

function initData() {
    listCnt.value = 0;
    authorizedMenuList.value = [];
    entireMenuList.value = [];
}

onBeforeMount(() => {
    gProp?.axios.all([commonts.getAuthList(gProp)]).then(
        gProp?.axios.spread((authListData: Array<{ [x: string]: any }>) => {
            if (svcType.value === 'ALL') {
                authList.value = authListData;
            } else {
                authListData.forEach((data: { [x: string]: any }) => {
                    if (data.svc_type === svcType.value) {
                        authList.value.push(data);
                    }
                });
            }
            nextProcess();
        })
    );
});

onMounted(() => {
    commonts.initPage({ docNameId: docName });
});

//페이지 떠날 떄, searchData 클리어
onUnmounted(() => {
    stores.common.clearSearchData();
});
</script>

<style>
.tb-mg-em04 {
    margin: 0.3rem;
}
.tb-mg-l0 {
    margin-left: -0.2rem !important;
}
.tb-mg-r0 {
    margin-right: -0.2rem !important;
}
@media (max-width: 768px) {
    .p-0 {
        margin: 0em !important;
    }
    .tb-mg-em04 {
        margin: 0em;
    }
}
@media (max-width: 991px) {
    .p-0 {
        margin: 0em !important;
    }
    .col-md-12,
    .col-md-11,
    .col-md-10,
    .col-md-9,
    .col-md-8,
    .col-md-7,
    .col-md-6,
    .col-md-5,
    .col-md-4,
    .col-md-3,
    .col-md-2,
    .col-md-1 {
        max-width: none;
    }
}
</style>
