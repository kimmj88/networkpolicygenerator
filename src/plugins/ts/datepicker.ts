import { base } from '@/plugins/ts/base';
import { commonVar } from '@/plugins/ts/commonVar';
import { computed, defineAsyncComponent, reactive, ref } from 'vue';

const TimePicker = defineAsyncComponent(() => import('@a/Datepicker.vue'));

export const datepicker = (props: { [x: string]: any }) => {
    const { gProp, commonts, t } = base();
    const { currentLang } = commonVar({ props: props });

    // datepicker time input 사용 여부
    const enableTimePicker = ref(false);
    if (props?.enableTimePicker !== undefined) {
        enableTimePicker.value = props?.enableTimePicker;
    }

    const weekStart = ref('0');

    const placeholderStr = ref(t('msg.error.no_input.select.date.default'));

    const maxDate = ref(new Date());

    const dp_locale = computed(() => currentLang?.value.datepicker_language);

    const dp_config = reactive({
        enableTimePicker: enableTimePicker.value,
        weekStart: weekStart.value,
        placeholderStr: placeholderStr.value,
        maxDate: maxDate.value,
        locale: dp_locale
    });

    const timePicker = computed(() => TimePicker);
    const today = computed(() => {
        return commonts.convertDate(
            gProp,
            '',
            enableTimePicker.value ? t('plugins.datepicker.format_dt') : t('plugins.datepicker.format'),
            ''
        );
    });

    // date 는 datePicker 에서 사용
    const date = ref(today.value);
    const dateSearch = ref(convertDateSearch(date.value));

    const dateRangeYear = ref([
        commonts.convertDateSubtract(gProp, today.value, 1, 'year'),
        commonts.convertDateEndOf(gProp, today.value, 'date', '')
    ]);
    const dateRangeMonth = ref([
        commonts.convertDateSubtract(gProp, commonts.convertDateStartOf(gProp, today.value, 'date', ''), 1, 'month'),
        commonts.convertDateEndOf(gProp, today.value, 'date', '')
    ]);
    const dateRange3Month = ref([
        commonts.convertDateSubtract(gProp, commonts.convertDateStartOf(gProp, today.value, 'date', ''), 3, 'month'),
        commonts.convertDateEndOf(gProp, today.value, 'date', '')
    ]);
    const dateRangeWeek = ref([
        commonts.convertDateSubtract(gProp, commonts.convertDateStartOf(gProp, today.value, 'date', ''), 1, 'week'),
        commonts.convertDateEndOf(gProp, today.value, 'date', '')
    ]);
    const dateRangeDay = ref([
        commonts.convertDateStartOf(gProp, today.value, 'date', ''),
        commonts.convertDateEndOf(gProp, today.value, 'date', '')
    ]);

    const dateRange = ref([] as any);
    const dateRangeSearch = ref([] as any);

    const type = props?.type?.toLowerCase();
    if (type === 'y' || type === 'year') {
        dateRange.value = dateRangeYear.value;
    } else if (type === 'w' || type === 'week') {
        dateRange.value = dateRangeWeek.value;
    } else if (type === 'd' || type === 'day') {
        dateRange.value = dateRangeDay.value;
    } else if (type === '3m' || type === '3month') {
        dateRange.value = dateRange3Month.value;
    } else {
        dateRange.value = dateRangeMonth.value;
    }

    dateRange.value.forEach((d: string) => {
        dateRangeSearch.value.push(convertDateSearch(d));
    });

    const dp_data = reactive({
        date: date.value,
        dateSearch: dateSearch.value,
        dateRange: dateRange.value,
        dateRangeSearch: dateRangeSearch.value
    });

    // formatter
    const dateFormat = (data: Date, timeFlag?: boolean) => {
        if (timeFlag === undefined) {
            timeFlag = enableTimePicker.value;
        }
        const dateStr: string = commonts.convertDate(
            gProp,
            data,
            timeFlag ? t('plugins.datepicker.format_dt') : t('plugins.datepicker.format')
        );
        return dateStr;
    };

    const dateRangeFormat = (data: Date[], timeFlag?: boolean) => {
        if (timeFlag === undefined) {
            timeFlag = enableTimePicker.value;
        }
        let dateStr: string = '';
        data.forEach((d: Date, idx: number) => {
            if (idx !== 0) dateStr += ' ~ ';
            dateStr += commonts.convertDate(
                gProp,
                d,
                timeFlag ? t('plugins.datepicker.format_dt') : t('plugins.datepicker.format')
            );
        });
        return dateStr;
    };

    function convertDateSearch(d: string | Date) {
        return commonts.convertDateToUtc(gProp, d, t('plugins.datepicker.format_dt_bs'));
    }

    function dateUpdate(data: any, target: any, key: Array<string>, cbFunc?: Function) {
        commonts.debugLog(gProp, [data, target, key]);
        key.forEach((t: string, idx: number) => {
            target[t] = convertDateSearch(key.length > 1 ? data[idx] : data);
        });
        if (cbFunc !== undefined) cbFunc(1);
    }

    const dp_func = {
        dateFormat: dateFormat,
        dateRangeFormat: dateRangeFormat,
        dateUpdate: dateUpdate
    };

    const dp_comp = {
        timePicker: timePicker.value
    };

    return {
        // variable
        dp_config,
        dp_data,
        // function
        dp_func,
        // component
        dp_comp
    };
};
