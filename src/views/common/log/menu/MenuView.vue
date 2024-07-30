<template>
    <div id="contents" class="content-wrapper">
        <ContentHeader />
        <ComponentMenu />
    </div>
</template>

<script setup lang="ts">
// @ is an alias to /src
import ContentHeader from '@/components/common/layout/ContentHeader.vue';
import ComponentMenu from '@/components/common/log/menu/Menu.vue';
import { onMounted, onUnmounted, ref } from 'vue';

const scrollTop = ref(0);

function scroll() {
    let screenScrollTop =
        document?.getElementById('contents')?.scrollTop === undefined
            ? 0
            : document?.getElementById('contents')?.scrollTop;
    scrollTop.value = screenScrollTop ?? 0;
}

onMounted(() => {
    document?.getElementById('contents')?.removeEventListener('scroll', scroll);
    document?.getElementById('contents')?.addEventListener('scroll', scroll);
});

onUnmounted(() => {
    document?.getElementById('contents')?.removeEventListener('scroll', scroll);
});
</script>
