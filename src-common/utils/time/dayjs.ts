// dayjs
import dayjs from 'dayjs';
import dayjs_isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import dayjs_isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import dayjs_timezone from 'dayjs/plugin/timezone';
import dayjs_utc from 'dayjs/plugin/utc';
import dayjs_weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(dayjs_utc);
dayjs.extend(dayjs_weekOfYear);
dayjs.extend(dayjs_isSameOrBefore);
dayjs.extend(dayjs_isSameOrAfter);
dayjs.extend(dayjs_timezone);

export default dayjs;
