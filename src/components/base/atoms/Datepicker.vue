<template>
    <div class="atom">
        <DatePicker
            :id="id"
            :name="name"
            :class="classText"
            :model-value="dateData"
            @update:model-value="dp_func.dateUpdate((dateData = $event), convertDate, dataType, updateDate)"
            :range="range"
            :multi-calendars="multiCalendars"
            :auto-apply="autoApply"
            :show-now-button="showNowButton"
            :year-first="yearFirst"
            :time-picker-inline="timePickerInline"
            :enable-seconds="true"
            :format="dp_func.dateRangeFormat"
            :enable-time-picker="dp_config.enableTimePicker"
            :week-start="dp_config.weekStart as any"
            :placeholder="dp_config.placeholderStr"
            :clearable="false"
            :locale="dp_config.locale"
            :tabindex="tabindex"
        >
            <template #input-icon>
                <em class="date-picker" />
            </template>
        </DatePicker>
    </div>
</template>

<script setup lang="ts">
import { base } from '@/plugins/ts/base';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';

import { datepicker } from '@/plugins/ts/datepicker';

const props = defineProps({
    id: {
        type: String,
        default: undefined
    },
    name: {
        type: String,
        default: undefined
    },
    type: {
        type: String,
        default: 'month'
    },
    classText: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Array],
        default: undefined
    },
    dataType: {
        type: Array<string>,
        default: ['search_from_time', 'search_to_time']
    },
    tabindex: {
        type: Number,
        default: 0
    },
    range: {
        type: Boolean,
        default: true
    },
    multiCalendars: {
        type: Boolean,
        default: true
    },
    autoApply: {
        type: Boolean,
        default: true
    },
    showNowButton: {
        type: Boolean,
        default: true
    },
    yearFirst: {
        type: Boolean,
        default: true
    },
    timePickerInline: {
        type: Boolean,
        default: true
    },
    enableSeconds: {
        type: Boolean,
        default: true
    }
});

// library
const { commonts, gProp } = base();
const { dp_config, dp_data, dp_func } = datepicker({ type: props.type, enableTimePicker: false });
const id = computed(() => props.id ?? uuidv4());
const name = computed(() => props.name ?? uuidv4());

const dateData = computed(() => props.modelValue ?? dp_data.dateRange);

const convertDate = ref([]);

const emit = defineEmits(['input:date']);

const updateDate = () => {
    commonts.debugLog(gProp, convertDate.value); // json 으로 넘김
    emit('input:date', convertDate.value);
};
</script>
