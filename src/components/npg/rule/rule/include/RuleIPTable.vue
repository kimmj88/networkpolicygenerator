<template>
    <div>
        <List :items="items" :headers="hedaers" :use-delete="true" :delete-callback="deleteIP" />
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import { AddressModalBaseType, TrafficDirectionType, ruleStore } from '@/stores/modules/Rule';
import List from './base/List.vue';
import { PropType } from 'vue';
import { storeToRefs } from 'pinia';

const { selected_src_ip_list, selected_dest_ip_list } = storeToRefs(ruleStore);
const props = defineProps({
    directionType: {
        type: String as PropType<TrafficDirectionType>,
        required: true
    }
});

const { t } = base();
const hedaers = [
    {
        title: 'IP',
        value: 'value'
    },
    {
        title: 'Title',
        value: 'title'
    },
    {
        title: 'Type',
        value: 'dataType'
    }
];

const items = props.directionType === 'SRC' ? selected_src_ip_list : selected_dest_ip_list;

function deleteIP(data: AddressModalBaseType) {
    ruleStore.deleteIPFromRule(props.directionType, data.id as string);
}
</script>

<style lang="scss" scoped></style>
