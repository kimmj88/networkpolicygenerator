<template>
    <div id="contents" class="content-wrapper">
        <ContentHeader />
        <MenuDetail :detail-info="detailInfo" />
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import ContentHeader from '@/components/common/layout/ContentHeader.vue';
import MenuDetail from '@/components/common/mng/menu/MenuDetail.vue';
import { base } from '@/plugins/ts/base';
import { computed } from 'vue';

const { stores } = base();
const detailInfo: { [x: string]: any } = computed(() => {
    return stores.common.detailInfo === undefined || stores.common.detailInfo === '' ? {} : stores.common.detailInfo;
});
</script>
