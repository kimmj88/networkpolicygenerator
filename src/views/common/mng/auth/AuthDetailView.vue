<template>
    <div id="contents" class="content-wrapper">
        <ContentHeader />
        <AuthDetail :detail-info="detailInfo" />
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import ContentHeader from '@/components/common/layout/ContentHeader.vue';
import AuthDetail from '@/components/common/mng/auth/AuthDetail.vue';
import { base } from '@/plugins/ts/base';
import { computed } from 'vue';

const { stores } = base();
const detailInfo: { [x: string]: any } = computed(() => {
    return stores.common.detailInfo === undefined || stores.common.detailInfo === '' ? {} : stores.common.detailInfo;
});
</script>
