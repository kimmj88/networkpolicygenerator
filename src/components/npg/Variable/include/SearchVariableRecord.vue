<template>
    <div>
        <SearchBase @click:search="goSearch">
            <template v-slot:body>
                <MoleDatepicker
                    :label-class-text="labelClassText"
                    :label-text="t('voca.create.time.default')"
                    :class-text="classText"
                    :data-type="dataType"
                    :model-value="dateRange"
                    @update:model-value="setDateData"
                />
                <MoleInput
                    :label-class-text="labelClassText"
                    :label-text="t('voca.key.group.name.default')"
                    :class-text="classText"
                    v-model="searchData.group_name"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                />
                <MoleSelect
                    :label-class-text="labelClassText"
                    :label-text="t('voca.emergency.status.default')"
                    :class-text="classText"
                    :place-holder="t('voca.all.default')"
                    :options="commonCode?.cmm104"
                    :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                    :reduce="(option: any) => option?.cm_cd"
                    v-model="searchData.emergency_flag"
                    @click:option="goSearch"
                />
                <MoleSelect
                    :label-class-text="labelClassText"
                    :label-text="t('voca.status.default')"
                    :class-text="classText"
                    :place-holder="t('voca.all.default')"
                    :options="commonCode?.cmm102"
                    :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                    :reduce="(option: any) => option?.cm_cd"
                    v-model="searchData.status"
                    @click:option="goSearch"
                />
                <MoleInput
                    :label-class-text="labelClassText"
                    :label-text="t('voca.create.id.default')"
                    :class-text="classText"
                    v-model="searchData.create_id"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                />
            </template>
        </SearchBase>
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import MoleDatepicker from '@m/DatepickerWithLabel.vue';
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import SearchBase from '@o/SearchBase.vue';
import { computed, ref, toRefs } from 'vue';

// library setting
// 권한에 따라 처리해야하는 경우
const { t } = base();
const { setEmptyMsg, setCodeMsg } = commonVar();

// props setting
const props = defineProps({
    searchData: {
        type: Object as any,
        required: true
    },
    commonCode: {
        type: Object as any,
        required: true
    }
});

// classText setting
const labelClassText = 'text-black w-full h-12 text-base font-bold';
const classText = 'text-black w-full h-10 text-base';

// variable setting
const { searchData, commonCode } = toRefs(props);

const dataType = ref(['search_from_time', 'search_to_time']);
const dateRange = computed(() => [props.searchData.search_from_time, props.searchData.search_to_time]);

function setDateData(data: Array<string>) {
    dataType.value.forEach((key: any) => {
        searchData.value[key] = data[key];
    });
    goSearch();
}

function goSearch() {
    searchData.value.page = 1;
    emit('click:search', searchData.value);
}

const emit = defineEmits(['click:search']);
</script>
