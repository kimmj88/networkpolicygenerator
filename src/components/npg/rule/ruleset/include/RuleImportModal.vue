<template>
    <div class="flex flex-col gap-4 p-4">
        <SearchRule :search-data="searchData" :common-code="commonCode" @click:search="goSearch" />
        <div :class="cardClass">
            {{ t('voca.count.argv.default', [reqList.length]) }}
            <List :items="parsedRuleList" :headers="hedaers" :multi-check="true" @update:selected-item="onSelectItem" />
        </div>

        <div class="flex gap-2 justify-end">
            <AtomButton type="list" :button-name="'Close'" @click="emit('close')" />
            <AtomButton type="import" :button-name="'Import'" @click="importRules" />
        </div>
    </div>
</template>

<script setup lang="ts">
const cardClass = 'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-3 p-4';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, reactive, Ref, ref } from 'vue';
import SearchRule from '../../rule/include/SearchRule.vue';
import AtomButton from '@/components/base/atoms/Button.vue';
import List from '../../rule/include/base/List.vue';
import { IRuleDTO, ISearchRuleDTO } from '@cm/types/domain/dto/rule/ruleDTO';

import { datepicker } from '@/plugins/ts/datepicker';
import { commonVar } from '@/plugins/ts/commonVar';
import { base } from '@/plugins/ts/base';
import { axios } from '@/plugins/ts/axios';
import { ListHeaderType, ListItemType } from '@/types/types';
import { rulesetStore } from '@/stores/modules/Ruleset';

const hedaers = [
    {
        title: 'Title',
        value: 'title',
        ratio: '40%',
        textAlign: 'left'
    },
    {
        title: 'Action',
        value: 'action',
        ratio: '15%'
    },
    {
        title: 'Msg',
        value: 'msg',
        ratio: '30%',
        textAlign: 'left'
    },
    {
        title: 'sid',
        value: 'sid',
        ratio: '15%',
        textAlign: 'left'
    }
] as ListHeaderType;

const props = defineProps({
    currScrollTop: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['close']);

const { stores, gProp, commonts, t, router } = base();
const { dp_data } = datepicker({ type: 'year' });
const { commonCode, paging, compPagePerData } = commonVar({
    props: props,
    searchFunc: goSearch
});
const { isAxiosFlag, getAxiosOptions, getErrorFunc, getFinallyFunc, pagingFillData } = axios();

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

const listCnt = ref(0);
const reqList = ref([] as Array<ListItemType>);
const parsedRuleList = computed(() => {
    return reqList.value.map((row) => spreadRule(row));
});
const selectedRuleIds: Ref<Set<number>> = ref(new Set());

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
    // commonts.setSearchData(stores, searchData, docName);
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
        isAxiosFlag.value = true;
        Object.assign(searchData, commonts.checkSearchData(paging.value, searchData, reqList.value));
        gProp?.axios
            .post(commonts.getUrl(gProp, '/rule/list'), searchData, getAxiosOptions('DATA', {}))
            // .post(commonts.getUrl(gProp, '/keygroup/group/list'), searchData, getAxiosOptions('DATA', {}))
            .then(({ data }: any) => {
                const ruleRow = data.data as IRuleDTO[];
                //새롭게 검색할 때 마다 선택 항목 초기화
                initSelectedRuleIds();
                if (paging.value === 'scroll' && reqList.value.length > 0) {
                    ruleRow.forEach((row) => {
                        reqList.value.push(row);
                    });
                } else {
                    reqList.value = ruleRow;
                }
                // paging 처리시 정해진 크기에 맞춰서 데이터 보이도록 부족한 데이터 채움
                pagingFillData(paging.value, reqList.value, searchData);
            })
            .catch(getErrorFunc)
            .finally(getFinallyFunc);
    }
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

function importRules() {
    const selectedRules = reqList.value.filter((rule) => selectedRuleIds.value.has(rule.id));
    rulesetStore.importRules(selectedRules);
}

function onSelectItem(item: any, value: boolean) {
    const id = item.id;
    if (value) {
        selectedRuleIds.value.add(id);
    } else {
        selectedRuleIds.value.delete(id);
    }
}

function initSelectedRuleIds() {
    selectedRuleIds.value = new Set();
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
    window.ipcRenderer.once([channel, 'return'].join('_'), (_evt, ret) => {
        Object.keys(ret).forEach((key: string) => (commonCode[key.toLowerCase()] = ret[key]));
        goSearch(0);
    });
});

onMounted(() => {});

onBeforeUnmount(() => {});
</script>

<style lang="scss" scoped></style>
