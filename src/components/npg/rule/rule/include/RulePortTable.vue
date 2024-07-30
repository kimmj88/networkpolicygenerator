<template>
    <div>
        <List :items="items" :headers="hedaers" :use-delete="true" :delete-callback="deletePort" />
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import { AddressModalBaseType, TrafficDirectionType, ruleStore } from '@/stores/modules/Rule';
import List from './base/List.vue';
import { PropType } from 'vue';
import { storeToRefs } from 'pinia';

const { selected_src_port_list, selected_dest_port_list } = storeToRefs(ruleStore);
const props = defineProps({
    directionType: {
        type: String as PropType<TrafficDirectionType>,
        required: true
    }
});

const { t } = base();
const hedaers = [
    {
        title: 'Port',
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
const items = props.directionType === 'SRC' ? selected_src_port_list : selected_dest_port_list;

function deletePort(data: AddressModalBaseType) {
    ruleStore.deletePortFromRule(props.directionType, data.id as string);
}
</script>

<style lang="scss" scoped></style>
TrafficDirectionType, import { PropType } from 'vue';
