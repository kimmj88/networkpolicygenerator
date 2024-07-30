<template>
    <div class="px-3 pb-3">
        <ListBase
            :data-list="dataList"
            :headers="headers"
            :common-code="commonCode"
            :emit-mapper="emitMapper"
            @click:object="clickObjectProcess"
        />
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import { commonVar } from '@/plugins/ts/commonVar';
import type { EmitMapperType, HeaderConfig, ListItemType } from '@/types/types';
import ListBase from '@o/ListBase.vue';
import { onMounted, ref, toRefs, type Ref } from 'vue';

const props = defineProps({
    dataList: {
        type: Array<ListItemType>,
        default: []
    },
    commonCode: {
        type: Object,
        default: {} as any
    }
});

const { dataList, commonCode } = toRefs(props);
const { svcType } = commonVar();

const headers: Ref<HeaderConfig> = ref({
    svc_type: {
        msg: 'voca.service.type.default',
        size: ['0%', '8%'],
        show: svcType.value === 'ALL',
        textClass: 'justify-start'
    },
    menu_id: {
        msg: 'voca.menu.id.default',
        size: ['10%', '10%'],
        textClass: 'justify-start'
    },
    menu_nm: {
        msg: 'voca.menu.name.default',
        size: ['12%', '14%'],
        textClass: 'justify-start'
    },
    menu_url: {
        msg: 'voca.menu.url.default',
        size: ['16%', '14%'],
        textClass: 'justify-start'
    },
    menu_dc: {
        msg: 'voca.menu.description.default',
        size: ['14%', '14%'],
        textClass: 'justify-start'
    },
    up_menu_id: {
        msg: 'voca.upper.menu.default',
        size: ['10%', '9%'],
        textClass: 'justify-center'
    },
    sort_order: {
        msg: 'voca.sort.order.default',
        size: ['10%', '9%'],
        textClass: 'justify-center'
    },
    use_yn: {
        msg: 'voca.use.yn.default',
        size: ['10%', '9%'],
        code: 'cmm902',
        textClass: 'justify-center'
    },
    create_time: {
        msg: 'voca.create.time.default',
        size: ['18%', '13%'],
        textClass: 'justify-center'
    }
});

const emitMapper: EmitMapperType = {
    menu_id: { type: 'text' }
};

function clickObjectProcess(key: string, data: string | number | object) {
    console.log(key, data);
    goDetail(data);
}

const emit = defineEmits(['click:detail']);
const goDetail = (data: any) => {
    emit('click:detail', data);
};

onMounted(() => {});
</script>
