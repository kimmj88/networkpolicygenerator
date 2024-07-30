<template>
    <div>
        <div class="flex justify-between py-2">
            <div class="title">{{ t('voca.rule.plural.default') }}</div>
            <AtomButton type="import" @click="openRuleSearchModal" :button-name="t('btn.import.default')" />
        </div>
        <div class="pl-4">
            <List :headers="hedaers" :items="rulesetStore.rules" :use-delete="true"
                :delete-callback="(item: any) => deleteRule(item.id)" :hover-effect="true" @click:row="selectRuleRow" />
        </div>

        <BasePopup index="200" :id="RULES_TABLE" :add-class="'max-w-5xl h-fit'" :add-body-class="'p-0'" @close="
            ruleSearchModalShow = false;
        commonts.hideModal(ruleSearchModal);
        " :is-show="ruleSearchModalShow">
            <template v-slot:title>{{ t('voca.ip.add.default') }}</template>
            <template v-slot:msg>
                <RuleImportModal @close="
                    ruleSearchModalShow = false;
                commonts.hideModal(ruleSearchModal);
                " />
            </template>
        </BasePopup>
    </div>
</template>

<script setup lang="ts">
const labelClassText = 'text-black w-full text-base font-medium ml-2 min-h-[3.5rem]';
const RULES_TABLE = 'RULES_TABLE';

import { onMounted, ref } from 'vue';
import { base } from '@/plugins/ts/base';
import { rulesetStore } from '@/stores/modules/Ruleset';
import List from '../../rule/include/base/List.vue';
import AtomButton from '@/components/base/atoms/Button.vue';
import BasePopup from '@/components/common/util/popup/BasePopup.vue';
import RuleImportModal from './RuleImportModal.vue';
import { IRuleDTO } from '@cm/types/domain/dto/rule/ruleDTO';
import { ListHeaderType } from '@/types/types';

const { stores, gProp, commonts, t, router } = base();

const props = defineProps({
    commonCode: {
        type: Object,
        default: {}
    }
});

const ruleSearchModal = ref(null as any);
const ruleSearchModalShow = ref(false);

const hedaers = [
    {
        title: 'Title',
        value: 'title',
        ratio: '15%',
        textAlign: 'left'
    },
    {
        title: 'Action',
        value: 'action',
        ratio: '5%'
    },
    {
        title: 'Protocol',
        value: 'rule_header.protocol',
        ratio: '10%'
    },
    {
        title: 'SrcIP',
        value: 'rule_header.source_address',
        ratio: '17.5%',
        textAlign: 'left'
    },
    {
        title: 'SrcPort',
        value: 'rule_header.source_port',
        ratio: '15%',
        textAlign: 'left'
    },
    {
        title: 'Dir',
        value: 'rule_header.direction_operator',
        ratio: '5%'
    },
    {
        title: 'DestIP',
        value: 'rule_header.dest_address',
        ratio: '17.5%',
        textAlign: 'left'
    },
    {
        title: 'DestPort',
        value: 'rule_header.dest_port',
        ratio: '15%',
        textAlign: 'left'
    }
] as ListHeaderType;

async function openRuleSearchModal() {
    ruleSearchModalShow.value = true;
    setTimeout(() => {
        commonts.showModal(ruleSearchModal.value, 200);
    }, 0);
}

function deleteRule(ruleId: number) {
    rulesetStore.deleteRuleFromRuleset(ruleId);
}

function selectRuleRow(item: IRuleDTO) {
    rulesetStore.selectRuleRow(item.id as number);
}

onMounted(() => {
    ruleSearchModal.value = commonts.makeModal(RULES_TABLE);
});
</script>

<style lang="scss" scoped>
.title {
    display: flex;
    align-items: center;
    font-weight: 500;
    min-height: 2.5rem;
    margin-left: 0.5rem;
}
</style>
