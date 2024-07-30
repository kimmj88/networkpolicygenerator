<template>
    <div>
        <SearchBase @click:search="onClickedSearch">
            <template v-slot:body>
                <MoleDatepicker :label-class-text="labelClassText" :label-text="t('voca.create.time.default')"
                    :class-text="classText" :data-type="dataType" :model-value="dateRange"
                    @update:model-value="onUpdatedDate" />
                <MoleSelect :label-class-text="labelClassText" :label-text="t('voca.type.default')"
                    :class-text="classText" :place-holder="t('voca.all.default')" :options="commonCode?.cmm300"
                    :get-option-label="(option: any) => setEmptyMsg(option, setCodeMsg(option))"
                    :reduce="(option: any) => option?.cd_nm" v-model="searchData.type_cd"
                    @click:option="onClickedSearch" />
                <MoleInput :label-class-text="labelClassText" :label-text="t('voca.title.default')"
                    :class-text="classText" v-model="searchData.title" @keyup.enter="onClickedSearch"
                    @keydown.tab="onClickedSearch" />
            </template>
        </SearchBase>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { SearchModuleDTO } from '@cm/types/domain/dto/module/moduleDTO';
import MoleDatepicker from '@m/DatepickerWithLabel.vue';
import MoleInput from '@m/InputWithLabel.vue';
import MoleSelect from '@m/SelectWithLabel.vue';
import SearchBase from '@o/SearchBase.vue';
import { PropType, computed, ref, toRefs } from 'vue';

interface DatePickerProps {
    create_time_from: string;
    create_time_to: string;
}

// library setting
const { t } = base();
const { setEmptyMsg, setCodeMsg } = commonVar();

// props setting
const props = defineProps({
    searchData: {
        type: Object as PropType<SearchModuleDTO>,
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
const dataType = ref<string[]>(['create_time_from', 'create_time_to']);
const dateRange = computed(() => [searchData.value.create_time_from, searchData.value.create_time_to]);

function onUpdatedDate(data: DatePickerProps, idx: number) {
    dataType.value.forEach((key: string) => {
        searchData.value[key as keyof SearchModuleDTO] = data[key as keyof DatePickerProps] as any;
    });
    searchData.value.page = 1;
    emit('click:search', searchData.value);
}

function onClickedSearch() {
    searchData.value.page = 1;
    emit('click:search', searchData.value);
}

const emit = defineEmits(['click:search']);
</script>
