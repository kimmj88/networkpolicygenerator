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
import { onBeforeMount, ref, toRefs, type Ref } from 'vue';

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

const { emitter, t } = base();
const { svcType } = commonVar();

const { dataList, commonCode } = toRefs(props);

const headers: Ref<HeaderConfig> = ref({
    svc_type: {
        msg: 'voca.service.type.default',
        size: ['0%', '10%'],
        show: svcType.value === 'ALL',
        textClass: 'justify-start'
    },
    group_name: {
        msg: 'voca.key.group.name.default',
        size: ['20%', '18%'],
        textClass: 'justify-start'
    },
    create_id: {
        msg: 'voca.create.id.default',
        size: ['20%', '18%'],
        textClass: 'justify-start'
    },
    create_time: {
        msg: 'voca.create.time.default',
        size: ['20%', '18%']
    },
    emergency_flag: {
        msg: 'voca.emergency.status.default',
        size: ['12%', '10%'],
        code: 'cmm104',
        textClass: 'justify-start'
    },
    status: {
        msg: 'voca.status.default',
        size: ['12%', '10%'],
        code: 'cmm102',
        textClass: 'justify-start'
    },
    no_search_key_download: {
        msg: 'voca.download.default',
        size: ['16%', '16%']
    }
});

const emitMapper: EmitMapperType = {
    no_search_key_download: {
        type: 'btn',
        btn_icon_class: 'bxc bxc-download',
        label: 'btn.download.default'
    }
};

function clickObjectProcess(key: string | number, data: string | object) {
    switch (key) {
        case 'group_name':
            console.log('goDetail', data);
            goDetail(data);
            break;
        case 'no_search_key_download':
            console.log('doDownloadConfirm', data);
            doDownloadConfirm(data);
            break;
        default:
            break;
    }
}

const targetData = ref(null as any);
function doDownloadConfirm(data: any) {
    targetData.value = data;
    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.file.download.default'),
        method: 'YN',
        cbFunc: doDownloadProcess
    });
}

function doDownloadProcess(retVal: boolean) {
    if (retVal) {
        doDownload(targetData.value);
    }

    targetData.value = null as any;
    return false;
}

const emit = defineEmits(['click:detail', 'click:download']);
const goDetail = (data: any) => {
    emit('click:detail', data);
};
const doDownload = (data: any) => {
    emit('click:download', data);
};

onBeforeMount(() => {});
</script>
