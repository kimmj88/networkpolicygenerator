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

const headers: Ref<HeaderConfig> = ref({
    title: {
        msg: 'voca.policy.title.default',
        size: '25%',
        textClass: 'justify-start'
    },
    count: {
        msg: 'voca.policy.module_count.default',
        size: '25%',
        textClass: 'justify-center'
    },
    create_time: {
        msg: 'voca.policy.create.time',
        size: '25%'
    },
    export: {
        msg: 'voca.policy.export.default',
        size: '25%',
        textClass: 'justify-center'
    }
});

const emitMapper: EmitMapperType = {
    title: { type: 'text' },
    export: {
        type: 'btn',
        // btn_icon_class: 'bxc bxc-download ',
        label: 'btn.export.default',
        btn_disabled: { condition: () => {}, visible: false }
    }
};

function clickObjectProcess(switch_key: string | number, data: string | object) {
    switch (switch_key) {
        case 'title':
            goDetail(data);
            break;
        case 'export':
            doExport(data);
            break;
        default:
            break;
    }
}

const emit = defineEmits(['click:detail', 'click:export']);
const goDetail = (data: any) => {
    emit('click:detail', data);
};
const doExport = (data: any) => {
    emit('click:export', data);
};

onMounted(() => {});
</script>
