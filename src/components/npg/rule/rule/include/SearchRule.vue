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
                    :label-text="t('voca.title.default')"
                    :class-text="classText"
                    v-model="searchData.title"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                />
                <MoleSelect
                    :label-class-text="labelClassText"
                    :label-text="t('voca.action.default')"
                    :class-text="classText"
                    :place-holder="t('voca.all.default')"
                    :options="commonCode?.cmm200"
                    :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                    :reduce="(option: any) => option?.cd"
                    v-model="searchData.action"
                    @click:option="goSearch"
                />
                <MoleSelect
                    :label-class-text="labelClassText"
                    :label-text="t('voca.protocol.default')"
                    :class-text="classText"
                    :place-holder="t('voca.all.default')"
                    :options="commonCode?.cmm201"
                    :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                    :reduce="(option: any) => option?.cd"
                    v-model="searchData.protocol"
                    @click:option="goSearch"
                />
                <MoleInput
                    :label-class-text="labelClassText"
                    :label-text="t('voca.source.ip.default')"
                    :class-text="classText"
                    v-model="searchData.source_address"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                />
                <MoleInput
                    :label-class-text="labelClassText"
                    :label-text="t('voca.source.port.default')"
                    :class-text="classText"
                    v-model="searchData.source_port"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                />
                <MoleSelect
                    :label-class-text="labelClassText"
                    :label-text="t('voca.direction.default')"
                    :class-text="classText"
                    :place-holder="t('voca.all.default')"
                    :options="commonCode?.cmm202"
                    :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                    :reduce="(option: any) => option?.cd"
                    v-model="searchData.direction_operator"
                    @click:option="goSearch"
                />
                <MoleInput
                    :label-class-text="labelClassText"
                    :label-text="t('voca.destination.ip.default')"
                    :class-text="classText"
                    v-model="searchData.dest_address"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                />
                <MoleInput
                    :label-class-text="labelClassText"
                    :label-text="t('voca.destination.port.default')"
                    :class-text="classText"
                    v-model="searchData.dest_port"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
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
const dataType = ref(['create_time_from', 'create_time_to']);
const dateRange = computed(() => [props.searchData.create_time_from, props.searchData.create_time_to]);

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
