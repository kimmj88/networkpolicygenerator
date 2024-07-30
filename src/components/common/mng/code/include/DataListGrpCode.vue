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
    grp_cd: {
        msg: 'voca.group.code.default',
        size: ['20%', '18%'],
        textClass: 'justify-start'
    },
    grp_cd_nm: {
        msg: 'voca.group.code.name.default',
        size: ['20%', '18%'],
        textClass: 'justify-start'
    },
    grp_cd_dc: {
        msg: 'voca.group.code.description.default',
        size: ['20%', '18%'],
        textClass: 'justify-start'
    },
    use_yn: {
        msg: 'voca.use.yn.default',
        size: ['14%', '13%'],
        code: 'cmm902',
        textClass: 'justify-center'
    },
    create_time: {
        msg: 'voca.create.time.default',
        size: ['26%', '25%'],
        textClass: 'justify-center'
    }
});

const emitMapper: EmitMapperType = {
    grp_cd: { type: 'text' }
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
