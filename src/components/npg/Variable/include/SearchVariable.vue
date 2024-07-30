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
                    :label-text="t('voca.key.default')"
                    :class-text="classText"
                    v-model="searchData.key"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                />
                <MoleSelect
                    :label-class-text="labelClassText"
                    :label-text="t('voca.type.default')"
                    :class-text="classText"
                    :place-holder="t('voca.all.default')"
                    :options="commonCode?.cmm100"
                    :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                    :reduce="(option: any) => option?.cd"
                    v-model="searchData.type_cd"
                    @click:option="goSearch"
                />
                <MoleInput
                    :label-class-text="labelClassText"
                    :label-text="t('voca.variable.value.default')"
                    :class-text="classText"
                    v-model="searchData.value"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                />
                <MoleSelect
                    v-if="svcType === 'ALL'"
                    :label-class-text="labelClassText"
                    :label-text="t('voca.service.type.default')"
                    :class-text="classText"
                    :place-holder="t('voca.all.default')"
                    :options="commonCode?.cmm100"
                    :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                    :reduce="(option: any) => option?.cd"
                    v-model="searchData.type_cd"
                    @click:option="goSearch"
                />
            </template>
        </SearchBase>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import MoleDatepicker from '@m/DatepickerWithLabel.vue';
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import SearchBase from '@o/SearchBase.vue';
import { computed, ref, toRefs } from 'vue';

// library setting
const { t } = base();
const { svcType, setEmptyMsg, setCodeMsg } = commonVar();

// props setting
const props = defineProps({
    searchData: {
        type: Object as any,
        required: true
    },
    commonCode: {
        type: Object as any,
        required: true
    },
    currScrollTop: {
        type: Number,
        default: 0
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
    searchData.value.type = emit('click:search', searchData.value);
}

const emit = defineEmits(['click:search']);
</script>
