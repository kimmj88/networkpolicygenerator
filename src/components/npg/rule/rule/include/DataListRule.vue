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
import { base } from '@/plugins/ts/base';
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

const { stores, commonts, gProp, emitter, t } = base();
const { svcType } = commonVar();

const { dataList, commonCode } = toRefs(props);

const headers: Ref<HeaderConfig> = ref({
    title: {
        msg: 'voca.title.default',
        size: '25%',
        textClass: 'justify-start'
    },
    action: {
        msg: 'voca.action.default',
        size: '10%'
    },
    protocol: {
        msg: 'voca.protocol.default',
        size: '10%'
    },
    source_address: {
        msg: 'voca.source.ip.default',
        size: '15%'
    },
    source_port: {
        msg: 'voca.source.port.default',
        size: '10%'
    },
    direction_operator: {
        msg: 'voca.direction.default',
        size: '5%'
    },
    dest_address: {
        msg: 'voca.destination.ip.default',
        size: '15%'
    },
    dest_port: {
        msg: 'voca.destination.port.default',
        size: '10%'
    }
});

const emitMapper: EmitMapperType = {
    title: { type: 'text' }
};

function clickObjectProcess(key: string | number, data: string | object) {
    switch (key) {
        case 'title':
            console.log('goDetail', data);
            goDetail(data);
            break;
        default:
            break;
    }
}

const emit = defineEmits(['click:detail', 'click:execute']);
const goDetail = (data: any) => {
    emit('click:detail', data);
};
const doExecute = (data: any) => {
    emit('click:execute', data);
};

onMounted(() => {});
</script>
