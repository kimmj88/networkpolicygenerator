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
import { computed, onMounted, ref, toRefs, type Ref } from 'vue';

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
    type_cd: {
        msg: 'voca.variable.type.default',
        size: '25%',
        textClass: 'justify-start'
    },
    key: {
        msg: 'voca.variable.key.default',
        size: '25%',
        textClass: 'justify-start'
    },
    value: {
        msg: 'voca.variable.value.default',
        size: '25%',
        textClass: 'justify-start'
    },
    create_time: {
        msg: 'voca.variable.create.time',
        size: '25%'
    }
});

const emitMapper: EmitMapperType = {
    key: { type: 'text' },
    no_search_key_execute: {
        type: 'btn',
        btn_icon_class: 'bxc bxc-run',
        label: 'btn.execute.default',
        btn_disabled: { condition: () => {}, visible: false }
    }
};

const executeData = ref({} as any);
const networkStatus = computed(() => stores.network.isActive);

function clickObjectProcess(switch_key: string | number, data: string | object) {
    switch (switch_key) {
        case 'key':
            console.log('goDetail', data);
            goDetail(data);
            break;
        case 'no_search_key_execute':
            console.log('doExecuteConfirm', data);
            if (!networkStatus.value) {
                commonts.notificationShow(
                    gProp,
                    'information',
                    t('msg.info.network.error.args.kms.default', [
                        t('voca.key.group.default') + ' ' + t('btn.execute.default')
                    ]),
                    1500
                );
                break;
            }
            doExecuteConfirm(data);
            break;
        default:
            break;
    }
}

function doExecuteConfirm(data: string | object) {
    executeData.value = data;
    emitter.emit('openConfirm', {
        title: t('voca.confirm.default'),
        msg: t('msg.confirm.run.default'),
        method: 'YN',
        cbFunc: doExecuteProcess
    });
}

function doExecuteProcess(retVal: boolean) {
    if (retVal) {
        doExecute(executeData?.value);
    }

    executeData.value = {} as any;
    return false;
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
