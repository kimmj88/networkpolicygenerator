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
        default: {}
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
    grp_cd: {
        msg: 'voca.group.code.default',
        size: ['10%', '10%'],
        textClass: 'justify-start'
    },
    cd: {
        msg: 'voca.code.default',
        size: ['10%', '10%'],
        textClass: 'justify-start'
    },
    cd_nm: {
        msg: 'voca.code.name.default',
        size: ['11%', '11%'],
        textClass: 'justify-start'
    },
    cd_dc: {
        msg: 'voca.code.description.default',
        size: ['11%', '11%'],
        textClass: 'justify-start'
    },
    item1: {
        msg: 'voca.code.item.1.default',
        size: ['5%', '5%'],
        textClass: 'justify-start'
    },
    item2: {
        msg: 'voca.code.item.2.default',
        size: ['5%', '5%'],
        textClass: 'justify-start'
    },
    item3: {
        msg: 'voca.code.item.3.default',
        size: ['5%', '5%'],
        textClass: 'justify-start'
    },
    item4: {
        msg: 'voca.code.item.4.default',
        size: ['5%', '5%'],
        textClass: 'justify-start'
    },
    item5: {
        msg: 'voca.code.item.5.default',
        size: ['5%', '5%'],
        textClass: 'justify-start'
    },
    sort_order: {
        msg: 'voca.sort.order.default',
        size: ['8%', '7%'],
        textClass: 'justify-center'
    },
    use_yn: {
        msg: 'voca.use.yn.default',
        size: ['8%', '7%'],
        code: 'cmm902',
        textClass: 'justify-center'
    },
    create_time: {
        msg: 'voca.create.time.default',
        size: ['16%', '16%'],
        textClass: 'justify-center'
    }
});

const emitMapper: EmitMapperType = {
    cd: { type: 'text' }
};

function clickObjectProcess(key: string | number, data: string | object) {
    console.log(key);
    goDetail(data);
}

const emit = defineEmits(['click:detail']);
const goDetail = (data: any) => {
    emit('click:detail', data);
};

onMounted(() => {});
</script>
