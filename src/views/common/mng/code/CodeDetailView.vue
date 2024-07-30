<template>
    <div id="contents" class="content-wrapper">
        <ContentHeader />
        <CodeDetail :detail-info="detailInfo" />
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import ContentHeader from '@/components/common/layout/ContentHeader.vue';
import CodeDetail from '@/components/common/mng/code/CodeDetail.vue';
import { base } from '@/plugins/ts/base';
import { computed } from 'vue';

const { stores } = base();
const detailInfo: { [x: string]: any } = computed(() => {
    return stores.common.detailInfo === undefined || stores.common.detailInfo === '' ? {} : stores.common.detailInfo;
});
</script>
