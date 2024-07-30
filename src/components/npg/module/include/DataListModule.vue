<template>
    <div class="px-3 pb-3">
        <ListBase :data-list="dataList" :headers="headers" :common-code="commonCode" :emit-mapper="emitMapper"
            @click:object="onClickedListItem" />
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import type { EmitMapperType, HeaderConfig, ListItemType } from '@/types/types';
import ListBase from '@o/ListBase.vue';
import { ref, toRefs, type Ref } from 'vue';

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

const headers: Ref<HeaderConfig> = ref({
    type_cd: {
        msg: 'voca.type.default',
        size: '30%',
        textClass: 'justify-start'
    },
    title: {
        msg: 'voca.title.default',
        size: '40%',
        textClass: 'justify-start'
    },
    create_time: {
        msg: 'voca.create.time.default',
        size: '30%'
    }
});

const emitMapper: EmitMapperType = {
    title: { type: 'text' }
};

function onClickedListItem(key: string | number, data: string | object) {
    switch (key) {
        case 'title':
            executeDetail(data);
            break;
        default:
            break;
    }
}

const emit = defineEmits(['click:detail']);
const executeDetail = (data: any) => {
    emit('click:detail', data);
};
</script>
