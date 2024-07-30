<template>
    <div>
        <SearchBase @click:search="goSearch">
            <template v-slot:body>
                <MoleInput
                    :label-class-text="labelClassText"
                    :label-text="t('voca.menu.id.default')"
                    :class-text="classText"
                    v-model="searchData.menu_id"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                    :tabindex="tabIdx.lstIn"
                />
                <MoleInput
                    :label-class-text="labelClassText"
                    :label-text="t('voca.menu.name.default')"
                    :class-text="classText"
                    v-model="searchData.menu_nm"
                    @keyup.enter="goSearch"
                    @keydown.tab="goSearch"
                    :tabindex="tabIdx.lstIn + 1"
                />
            </template>
        </SearchBase>
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import MoleInput from '@m/InputWithLabel.vue';
import SearchBase from '@o/SearchBase.vue';
import { toRefs } from 'vue';

// library setting
const { t } = base();
// const { svcType, setEmptyMsg, setCodeMsg } = commonVar();
const { tabIdx } = commonVar();

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
const { searchData } = toRefs(props);
// const dataType = ref(['search_from_time', 'search_to_time'])
// const dateRange = computed(() => [props.searchData.search_from_time, props.searchData.search_to_time])

// function setDateData(data: Array<string>) {
//     dataType.value.forEach((key: any) => {
//         searchData.value[key] = data[key]
//     })
//     goSearch()
// }

function goSearch() {
    searchData.value.page = 1;
    emit('click:search', searchData.value);
}

const emit = defineEmits(['click:search']);
</script>
