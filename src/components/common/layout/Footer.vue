<template>
    <footer id="footer">
        <span>
            {{ t('voca.copyright.default') }}
            <a :href="data.companyUrl" class="cp" target="_new" :tabindex="data.tabidx">
                {{ t('voca.company.autocrypt.default') }}
            </a>
            . {{ t('voca.copyright.owner.default') }}
            <br />
        </span>
        <strong>{{ t('voca.company.autocrypt.script.default') }}</strong>
    </footer>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import { reactive } from 'vue';

const { gProp, t } = base();

let data = reactive({
    companyUrl: t('voca.company.autocrypt.url'),
    tabidx: gProp?.$commonts.getInitTabIdx('footer')
});
</script>
