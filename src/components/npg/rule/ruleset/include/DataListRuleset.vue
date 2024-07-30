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
        size: '33.3%',
        textClass: 'justify-start'
    },
    description: {
        msg: 'voca.description.default',
        size: '33.3%',
        textClass: 'justify-start'
    },
    create_time: {
        msg: 'voca.create.time.default',
        size: '33.3%',
        textClass: 'justify-center'
    }
});

const emitMapper: EmitMapperType = {
    title: { type: 'text' }
};

function clickObjectProcess(key: string | number, data: string | object) {
    switch (key) {
        case 'title':
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
