<template>
    <div class="p-3 h-full">
        <ListBase
            :data-list="dataList as any"
            :headers="headers"
            :common-code="commonCode"
            :emit-mapper="emitMapper"
            :sort-flag="false"
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
import { ref, toRefs, type Ref } from 'vue';

const props = defineProps({
    dataList: {
        type: Array<ListItemType>,
        default: []
    },
    commonCode: {
        type: Object,
        default: {} as any
    },
    kmsKeys: {
        type: Object,
        default: {} as any
    }
});

const { svcType } = commonVar();

const { dataList, commonCode } = toRefs(props);

const deleteData = ref({} as any);

const headers: Ref<HeaderConfig> = ref({
    svc_type: {
        msg: 'voca.service.type.default',
        size: ['0%', '10%'],
        show: svcType.value === 'ALL'
    },
    group_name: {
        msg: 'voca.key.group.name.default',
        size: ['17%', '16%']
    },
    key_type: {
        msg: 'voca.key.type.default',
        size: ['15%', '16%'],
        code: 'cmm103'
    },
    key_name: {
        msg: 'voca.key.name.default',
        size: ['17%', '16%']
    },
    key_cnt: {
        msg: 'voca.count.default',
        size: ['8%', '10%']
    },
    create_id: {
        msg: 'voca.create.id.default',
        size: ['16%', '15%']
    },
    create_time: {
        msg: 'voca.create.time.default',
        size: ['16%', '15%']
    },
    no_search_key_delete: {
        msg: 'voca.delete.default',
        size: ['11%', '12%']
    }
});

const emitMapper: EmitMapperType = {
    no_search_key_delete: {
        type: 'btn',
        btn_icon_class: 'bxc bxc-eraser',
        label: 'btn.delete.default'
    }
};

function clickObjectProcess(key: string | number, data: string | object) {
    if (key === 'no_search_key_delete') {
        console.log('doDeleteConfirm', data);
        doDeleteConfirm(data);
    }
}

const { emitter, t } = base();

function doDeleteConfirm(data: any) {
    deleteData.value = data;
    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.delete.default'),
        method: 'YN',
        cbFunc: doDeleteProcess
    });
}

function doDeleteProcess(retVal: boolean) {
    if (retVal) {
        doDelete();
    }

    deleteData.value = {};
    return false;
}

function doDelete() {
    emit('click:delete', deleteData.value);
}

const emit = defineEmits(['click:delete']);
</script>
